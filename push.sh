# Definindo variáveis
REGISTRY=opi:5000
IMAGE_NAME=bot-hamster-kombat

# Função para incrementar a versão
increment_version() {
  local version=$1
  local major=$(echo $version | cut -d. -f1)
  local minor=$(echo $version | cut -d. -f2)
  local patch=$(echo $version | cut -d. -f3)
  patch=$((patch + 1))
  echo "$major.$minor.$patch"
}

# Obtendo a versão atual do package.json
CURRENT_VERSION=$(grep -oP '(?<="version": ")[^"]*' package.json)
NEW_VERSION=$(increment_version $CURRENT_VERSION)

# Atualizando a versão no package.json
sed -i '' -e "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# Commit das mudanças
git add package.json
git commit -m "feat: new version $NEW_VERSION"
git push

# Construindo e empurrando a imagem Docker
docker build -t $REGISTRY/$IMAGE_NAME:$NEW_VERSION .
docker push $REGISTRY/$IMAGE_NAME:$NEW_VERSION

# Verificando o catálogo do registry
curl -X GET $REGISTRY/v2/_catalog

echo "Nova versão da imagem: $REGISTRY/$IMAGE_NAME:$NEW_VERSION"