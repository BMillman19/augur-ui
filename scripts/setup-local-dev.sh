#!/usr/bin/env bash
trap "kill 0" EXIT

set -ex;

export USE_POPULATED_CONTRACTS="${USE_POPULATED_CONTRACTS:-true}"

export USE_NORMAL_TIME=${USE_NORMAL_TIME:-false}
export ETHEREUM_HOST=${ETHEREUM_HOST:-127.0.0.1}
export ETHEREUM_GAS_PRICE_IN_NANOETH=${ETHEREUM_GAS_PRICE_IN_NANOETH:-1}
export ETHEREUM_HTTP=${ETHEREUM_HTTP:-http://127.0.0.1:8545}
export ETHEREUM_WS=${ETHEREUM_WS:-http://127.0.0.1:8546}

export ETHEREUM_PRIVATE_KEY=${ETHEREUM_PRIVATE_KEY:-fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a}

CONTAINER_NAME="geth-node";
if $USE_POPULATED_CONTRACTS; then
  DOCKER_IMAGE="augurproject/dev-pop-geth:latest";
else
  DOCKER_IMAGE="augurproject/dev-node-geth:latest";
fi

if [ "$(docker ps -a | grep $CONTAINER_NAME)" ]; then
  echo "Kill running container...";
  docker kill $CONTAINER_NAME;
fi

echo "$CONTAINER_NAME: $DOCKER_IMAGE";
docker pull $DOCKER_IMAGE;
docker run -it -d --rm --name $CONTAINER_NAME -p 8545:8545 -p 8546:8546 $DOCKER_IMAGE;

cd ../;

echo "Building augur.js";
pushd augur.js;
rm -rf node_modules;
yarn;
yarn run build;
yarn link;

if $USE_POPULATED_CONTRACTS; then
  docker cp $CONTAINER_NAME:/augur.js/src/contracts/addresses.json src/contracts/addresses.json
  docker cp $CONTAINER_NAME:/augur.js/src/contracts/upload-block-numbers.json src/contracts/upload-block-numbers.json
else
  yarn run deploy:environment
fi

popd;

echo "Start augur-node";
pushd augur-node;
rm -rf node_modules;
yarn install;
yarn link augur.js;
yarn run clean-start &

popd;

echo "Start augur (UI)";
pushd augur;
rm -rf node_modules;
yarn;
yarn link augur.js;
yarn run dev &

wait
