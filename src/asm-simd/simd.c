#include <wasm_simd128.h>
#include "wasmenv.h"

struct Point {
  float x;
  float y;
  float z;
  float w;
};

EM_PORT_API(int) process_simd(struct Point* dst, const struct Point* src, int len, const float* matrix) {

  int i;

  __f32x4 m0 = wasm_f32x4_splat(*matrix);
  __f32x4 m1 = wasm_f32x4_splat(*(matrix + 1));
  __f32x4 m2 = wasm_f32x4_splat(*(matrix + 2));
  __f32x4 m3 = wasm_f32x4_splat(*(matrix + 3));
  __f32x4 m4 = wasm_f32x4_splat(*(matrix + 4));
  __f32x4 m5 = wasm_f32x4_splat(*(matrix + 5));
  __f32x4 m6 = wasm_f32x4_splat(*(matrix + 6));
  __f32x4 m7 = wasm_f32x4_splat(*(matrix + 7));
  __f32x4 m8 = wasm_f32x4_splat(*(matrix + 8));
  __f32x4 m9 = wasm_f32x4_splat(*(matrix + 9));
  __f32x4 m10 = wasm_f32x4_splat(*(matrix + 10));
  __f32x4 m11 = wasm_f32x4_splat(*(matrix + 11));
  __f32x4 m12 = wasm_f32x4_splat(*(matrix + 12));
  __f32x4 m13 = wasm_f32x4_splat(*(matrix + 13));
  __f32x4 m14 = wasm_f32x4_splat(*(matrix + 14));
  __f32x4 m15 = wasm_f32x4_splat(*(matrix + 15));

  for (i = 0; i < len; i++) {
    __f32x4 point0 = wasm_v128_load(src);
    __f32x4 point1 = wasm_v128_load(src + 1);
    __f32x4 point2 = wasm_v128_load(src + 2);
    __f32x4 point3 = wasm_v128_load(src + 3);

    __f32x4 l0 = wasm_i32x4_shuffle(point0, point1, 0, 4, 1, 5);
    __f32x4 l1 = wasm_i32x4_shuffle(point0, point1, 2, 6, 3, 7);
    __f32x4 l2 = wasm_i32x4_shuffle(point2, point3, 0, 4, 1, 5);
    __f32x4 l3 = wasm_i32x4_shuffle(point2, point3, 2, 6, 3, 7);

    __f32x4 x = wasm_i64x2_shuffle(l0, l2, 0, 2);
    __f32x4 y = wasm_i64x2_shuffle(l0, l2, 1, 3);
    __f32x4 z = wasm_i64x2_shuffle(l1, l3, 0, 2);
    __f32x4 w = wasm_i64x2_shuffle(l1, l3, 1, 3);

    // __f32x4 x = wasm_f32x4_make(point1[0], point2[0], point3[0], point4[0]);
    // __f32x4 y = wasm_f32x4_make(point1[1], point2[1], point3[1], point4[1]);
    // __f32x4 z = wasm_f32x4_make(point1[2], point2[2], point3[2], point4[2]);
    // __f32x4 w = wasm_f32x4_make(point1[3], point2[3], point3[3], point4[3]);

    __f32x4 s0 = x * m0 + y * m4 + z * m8 + w * m12;
    __f32x4 s1 = x * m1 + y * m5 + z * m9 + w * m13;
    __f32x4 s2 = x * m2 + y * m6 + z * m10 + w * m14;
    __f32x4 s3 = x * m3 + y * m7 + z * m11 + w * m15;

    // point1 = wasm_f32x4_make(s0[0], s1[0], s2[0], s3[0]);
    // point2 = wasm_f32x4_make(s0[1], s1[1], s2[1], s3[1]);
    // point3 = wasm_f32x4_make(s0[2], s1[2], s2[2], s3[2]);
    // point4 = wasm_f32x4_make(s0[3], s1[3], s2[3], s3[3]);

    l0 = wasm_i64x2_shuffle(s0, s1, 0, 2);
    l1 = wasm_i64x2_shuffle(s0, s1, 1, 3);
    l2 = wasm_i64x2_shuffle(s2, s3, 0, 2);
    l3 = wasm_i64x2_shuffle(s2, s3, 1, 3);

    point0 = wasm_i32x4_shuffle(l0, l2, 0, 2, 4, 6);
    point1 = wasm_i32x4_shuffle(l0, l2, 1, 3, 5, 7);
    point2 = wasm_i32x4_shuffle(l1, l3, 0, 2, 4, 6);
    point3 = wasm_i32x4_shuffle(l1, l3, 1, 3, 5, 7);

    wasm_v128_store(dst, point0);
    wasm_v128_store(dst + 1, point1);
    wasm_v128_store(dst + 2, point2);
    wasm_v128_store(dst + 3, point3);

    i += 4;
  }
  return 0;
}

EM_PORT_API(int) process(struct Point* dst, const struct Point* src, int len, const float* matrix) {
  int i;
  for (i = 0; i < len; i++) {
    dst[i].x = src[i].x * matrix[0] + src[i].y * matrix[4] + src[i].z * matrix[8] + src[i].w * matrix[12];
    dst[i].y = src[i].x * matrix[1] + src[i].y * matrix[5] + src[i].z * matrix[9] + src[i].w * matrix[13];
    dst[i].z = src[i].x * matrix[2] + src[i].y * matrix[6] + src[i].z * matrix[10] + src[i].w * matrix[14];
    dst[i].w = src[i].x * matrix[3] + src[i].y * matrix[7] + src[i].z * matrix[11] + src[i].w * matrix[15];
  }
  return 0;
}