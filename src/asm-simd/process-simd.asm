
(func $process_simd (export "process_simd") (param $dst i32) (param $src i32) (param $len i32) (param $matrix i32) (result i32)
  
  (local $matrix0 v128)
  (local $matrix1 v128)
  (local $matrix2 v128)
  (local $matrix3 v128)
  (local $matrix4 v128)
  (local $matrix5 v128)
  (local $matrix6 v128)
  (local $matrix7 v128)
  (local $matrix8 v128)
  (local $matrix9 v128)
  (local $matrix10 v128)
  (local $matrix11 v128)
  (local $matrix12 v128)
  (local $matrix13 v128)
  (local $matrix14 v128)
  (local $matrix15 v128)

  (local $i i32)
  (local $s i32)
  (local $d i32)

  (local $p0 v128)
  (local $p1 v128)
  (local $p2 v128)
  (local $p3 v128)

  (local $l0 v128)
  (local $l1 v128)
  (local $l2 v128)
  (local $l3 v128)

  (local $x v128)
  (local $y v128)
  (local $z v128)
  (local $w v128)

  (local $s0 v128)
  (local $s1 v128)
  (local $s2 v128)
  (local $s3 v128)

  (local.set $matrix0 (v128.load32_splat offset=0 (local.get $matrix)))
  (local.set $matrix1 (v128.load32_splat offset=4 (local.get $matrix)))
  (local.set $matrix2 (v128.load32_splat offset=8 (local.get $matrix)))
  (local.set $matrix3 (v128.load32_splat offset=12 (local.get $matrix)))
  (local.set $matrix4 (v128.load32_splat offset=16 (local.get $matrix)))
  (local.set $matrix5 (v128.load32_splat offset=20 (local.get $matrix)))
  (local.set $matrix6 (v128.load32_splat offset=24 (local.get $matrix)))
  (local.set $matrix7 (v128.load32_splat offset=28 (local.get $matrix)))
  (local.set $matrix8 (v128.load32_splat offset=32 (local.get $matrix)))
  (local.set $matrix9 (v128.load32_splat offset=36 (local.get $matrix)))
  (local.set $matrix10 (v128.load32_splat offset=40 (local.get $matrix)))
  (local.set $matrix11 (v128.load32_splat offset=44 (local.get $matrix)))
  (local.set $matrix12 (v128.load32_splat offset=48 (local.get $matrix)))
  (local.set $matrix13 (v128.load32_splat offset=52 (local.get $matrix)))
  (local.set $matrix14 (v128.load32_splat offset=56 (local.get $matrix)))
  (local.set $matrix15 (v128.load32_splat offset=60 (local.get $matrix)))

  (local.set $i (i32.const 0))

  ;; i < len
  (i32.lt_s
    (local.get $i)
    (local.get $len)
  )

  if
    (loop $loop
      ;; s = src + i
      (local.set $s (i32.add (local.get $src) (i32.mul (local.get $i) (i32.const 16))))
      ;; d = dst + i
      (local.set $d (i32.add (local.get $dst) (i32.mul (local.get $i) (i32.const 16))))

      (local.set $p0
        (v128.load offset=0
          (local.get $s)
        )
      )
      (local.set $p1
        (v128.load offset=16
          (local.get $s)
        )
      )
      (local.set $p2
        (v128.load offset=32
          (local.get $s)
        )
      )
      (local.set $p3
        (v128.load offset=48
          (local.get $s)
        )
      )

      (local.set $l0
        (i8x16.shuffle 0 1 2 3 16 17 18 19 4 5 6 7 20 21 22 23
          (local.get $p0)
          (local.get $p1)
        )
      )
      (local.set $l1
        (i8x16.shuffle 8 9 10 11 24 25 26 27 12 13 14 15 28 29 30 31
          (local.get $p0)
          (local.get $p1)
        )
      )
      (local.set $l2
        (i8x16.shuffle 0 1 2 3 16 17 18 19 4 5 6 7 20 21 22 23
          (local.get $p2)
          (local.get $p3)
        )
      )
      (local.set $l3
        (i8x16.shuffle 8 9 10 11 24 25 26 27 12 13 14 15 28 29 30 31
          (local.get $p2)
          (local.get $p3)
        )
      )

      (local.set $x
        (i8x16.shuffle 0 1 2 3 4 5 6 7 16 17 18 19 20 21 22 23
          (local.get $l0)
          (local.get $l2)
        )
      )
      (local.set $y
        (i8x16.shuffle 8 9 10 11 12 13 14 15 24 25 26 27 28 29 30 31
          (local.get $l0)
          (local.get $l2)
        )
      )
      (local.set $z
        (i8x16.shuffle 0 1 2 3 4 5 6 7 16 17 18 19 20 21 22 23
          (local.get $l1)
          (local.get $l3)
        )
      )
      (local.set $w
        (i8x16.shuffle 8 9 10 11 12 13 14 15 24 25 26 27 28 29 30 31
          (local.get $l1)
          (local.get $l3)
        )
      )

      (local.set $s0
        (f32x4.add
          ;; x * matrix0
          (f32x4.mul
            (local.get $x)
            (local.get $matrix0)
          )
          (f32x4.add
            ;; y * matrix4
            (f32x4.mul
              (local.get $y)
              (local.get $matrix4)
            )
            (f32x4.add
              ;; z * matrix8
              (f32x4.mul
                (local.get $z)
                (local.get $matrix8)
              )
              ;; w * matrix12
              (f32x4.mul
                (local.get $w)
                (local.get $matrix12)
              )
            )
          )
        )
      )

      (local.set $s1
        (f32x4.add
          ;; x * matrix1
          (f32x4.mul
            (local.get $x)
            (local.get $matrix1)
          )
          (f32x4.add
            ;; y * matrix5
            (f32x4.mul
              (local.get $y)
              (local.get $matrix5)
            )
            (f32x4.add
              ;; z * matrix9
              (f32x4.mul
                (local.get $z)
                (local.get $matrix9)
              )
              ;; w * matrix13
              (f32x4.mul
                (local.get $w)
                (local.get $matrix13)
              )
            )
          )
        )
      )

      (local.set $s2
        (f32x4.add
          ;; x * matrix2
          (f32x4.mul
            (local.get $x)
            (local.get $matrix2)
          )
          (f32x4.add
            ;; y * matrix6
            (f32x4.mul
              (local.get $y)
              (local.get $matrix6)
            )
            (f32x4.add
              ;; z * matrix10
              (f32x4.mul
                (local.get $z)
                (local.get $matrix10)
              )
              ;; w * matrix14
              (f32x4.mul
                (local.get $w)
                (local.get $matrix14)
              )
            )
          )
        )
      )

      (local.set $s3
        (f32x4.add
          ;; x * matrix3
          (f32x4.mul
            (local.get $x)
            (local.get $matrix3)
          )
          (f32x4.add
            ;; y * matrix7
            (f32x4.mul
              (local.get $y)
              (local.get $matrix7)
            )
            (f32x4.add
              ;; z * matrix11
              (f32x4.mul
                (local.get $z)
                (local.get $matrix11)
              )
              ;; w * matrix15
              (f32x4.mul
                (local.get $w)
                (local.get $matrix15)
              )
            )
          )
        )
      )

      (local.set $l0
        (i8x16.shuffle 0 1 2 3 4 5 6 7 16 17 18 19 20 21 22 23
          (local.get $s0)
          (local.get $s1)
        )
      )
      (local.set $l1
        (i8x16.shuffle 8 9 10 11 12 13 14 15 24 25 26 27 28 29 30 31
          (local.get $s0)
          (local.get $s1)
        )
      )
      (local.set $l2
        (i8x16.shuffle 0 1 2 3 4 5 6 7 16 17 18 19 20 21 22 23
          (local.get $s2)
          (local.get $s3)
        )
      )
      (local.set $l3
        (i8x16.shuffle 8 9 10 11 12 13 14 15 24 25 26 27 28 29 30 31
          (local.get $s2)
          (local.get $s3)
        )
      )


      (local.set $p0
        (i8x16.shuffle 0 1 2 3 8 9 10 11 16 17 18 19 24 25 26 27
          (local.get $l0)
          (local.get $l2)
        )
      )
      (local.set $p1
        (i8x16.shuffle 4 5 6 7 12 13 14 15 20 21 22 23 28 29 30 31
          (local.get $l0)
          (local.get $l2)
        )
      )
      (local.set $p2
        (i8x16.shuffle 0 1 2 3 8 9 10 11 16 17 18 19 24 25 26 27
          (local.get $l1)
          (local.get $l3)
        )
      )
      (local.set $p3
        (i8x16.shuffle 4 5 6 7 12 13 14 15 20 21 22 23 28 29 30 31
          (local.get $l1)
          (local.get $l3)
        )
      )

      (v128.store offset=0
        (local.get $d)
        (local.get $p0)
      )
      (v128.store offset=16
        (local.get $d)
        (local.get $p1)
      )
      (v128.store offset=32
        (local.get $d)
        (local.get $p2)
      )
      (v128.store offset=48
        (local.get $d)
        (local.get $p3)
      )

      ;; i++
      (local.set $i
        (i32.add
          (local.get $i)
          (i32.const 4)
        )
      )
      ;; i < len
      (i32.lt_s
        (local.get $i)
        (local.get $len)
      )

      (br_if $loop)
    )
  end

  ;; return
  (i32.const 0)
)