NOW_PATH=$(cd $(dirname $0); pwd)

PROJECT_SRC_PATH=$NOW_PATH/..

source $NOW_PATH/../../../emsdk/emsdk_env.sh

emcc -o3 --no-entry -Wl,--no-check-features $NOW_PATH/main.c \
  -I "$PROJECT_SRC_PATH/cheap/include" \
  -s WASM=1 \
  -s FILESYSTEM=0 \
  -s FETCH=0 \
  -s ASSERTIONS=0 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s IMPORTED_MEMORY=1 \
  -s INITIAL_MEMORY=16777216 \
  -s USE_PTHREADS=0 \
  -s MAIN_MODULE=2 \
  -s SIDE_MODULE=0 \
  -s MALLOC="none" \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -o $NOW_PATH/main.wasm