#include "wasmenv.h"
#include <stdio.h>

struct data {
  int a;
  int b;
  int sum;
};

EM_PORT_API(void) interoperate(struct data* in) {
  in->sum = in->a + in->b;
  printf("wasm: a: %d, b: %d, sum: %d\n", in->a, in->b, in->sum);
}