# declare a var with the host and port of the registry
REGISTRY=opi:5000
IMAGE_NAME=bot-hamster-kombat
IMAGE_VERSION=1.1.3

docker build -t $IMAGE_NAME:$IMAGE_VERSION .

docker push $REGISTRY/$IMAGE_NAME:$IMAGE_VERSION

curl -X GET $REGISTRY/v2/_catalog
