  export default asm`
  (func $process (export "process") (param $dst i32) (param $src i32) (param $len i32) (param $matrix i32) (result i32)
    
    (local $matrix0 f32)
    (local $matrix1 f32)
    (local $matrix2 f32)
    (local $matrix3 f32)
    (local $matrix4 f32)
    (local $matrix5 f32)
    (local $matrix6 f32)
    (local $matrix7 f32)
    (local $matrix8 f32)
    (local $matrix9 f32)
    (local $matrix10 f32)
    (local $matrix11 f32)
    (local $matrix12 f32)
    (local $matrix13 f32)
    (local $matrix14 f32)
    (local $matrix15 f32)

    (local $i i32)
    (local $s i32)
    (local $d i32)

    (local.set $matrix0 (f32.load offset=0 (local.get $matrix)))
    (local.set $matrix1 (f32.load offset=4 (local.get $matrix)))
    (local.set $matrix2 (f32.load offset=8 (local.get $matrix)))
    (local.set $matrix3 (f32.load offset=12 (local.get $matrix)))
    (local.set $matrix4 (f32.load offset=16 (local.get $matrix)))
    (local.set $matrix5 (f32.load offset=20 (local.get $matrix)))
    (local.set $matrix6 (f32.load offset=24 (local.get $matrix)))
    (local.set $matrix7 (f32.load offset=28 (local.get $matrix)))
    (local.set $matrix8 (f32.load offset=32 (local.get $matrix)))
    (local.set $matrix9 (f32.load offset=36 (local.get $matrix)))
    (local.set $matrix10 (f32.load offset=40 (local.get $matrix)))
    (local.set $matrix11 (f32.load offset=44 (local.get $matrix)))
    (local.set $matrix12 (f32.load offset=48 (local.get $matrix)))
    (local.set $matrix13 (f32.load offset=52 (local.get $matrix)))
    (local.set $matrix14 (f32.load offset=56 (local.get $matrix)))
    (local.set $matrix15 (f32.load offset=60 (local.get $matrix)))

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

        (f32.store offset=0
          (local.get $d)
          (f32.add
            ;; src[i].x * matrix[0]
            (f32.mul
              (f32.load offset=0
                (local.get $s)
              )
              (local.get $matrix0)
            )
            (f32.add
              ;; src[i].y * matrix[4]
              (f32.mul
                (f32.load offset=4
                  (local.get $s)
                )
                (local.get $matrix4)
              )
              (f32.add
                ;; src[i].z * matrix[8]
                (f32.mul
                  (f32.load offset=8
                    (local.get $s)
                  )
                  (local.get $matrix8)
                )
                ;; src[i].w * matrix[12]
                (f32.mul
                  (f32.load offset=12
                    (local.get $s)
                  )
                  (local.get $matrix12)
                )
              )
            )
          )
        )

        (f32.store offset=4
          (local.get $d)
          (f32.add
            ;; src[i].x * matrix[1]
            (f32.mul
              (f32.load offset=0
                (local.get $s)
              )
              (local.get $matrix1)
            )
            (f32.add
              ;; src[i].y * matrix[5]
              (f32.mul
                (f32.load offset=4
                  (local.get $s)
                )
                (local.get $matrix5)
              )
              (f32.add
                ;; src[i].z * matrix[9]
                (f32.mul
                  (f32.load offset=8
                    (local.get $s)
                  )
                  (local.get $matrix9)
                )
                ;; src[i].w * matrix[13]
                (f32.mul
                  (f32.load offset=12
                    (local.get $s)
                  )
                  (local.get $matrix13)
                )
              )
            )
          )
        )

        (f32.store offset=8
          (local.get $d)
          (f32.add
            ;; src[i].x * matrix[2]
            (f32.mul
              (f32.load offset=0
                (local.get $s)
              )
              (local.get $matrix2)
            )
            (f32.add
              ;; src[i].y * matrix[6]
              (f32.mul
                (f32.load offset=4
                  (local.get $s)
                )
                (local.get $matrix6)
              )
              (f32.add
                ;; src[i].z * matrix[10]
                (f32.mul
                  (f32.load offset=8
                    (local.get $s)
                  )
                  (local.get $matrix10)
                )
                ;; src[i].w * matrix[14]
                (f32.mul
                  (f32.load offset=12
                    (local.get $s)
                  )
                  (local.get $matrix14)
                )
              )
            )
          )
        )

        (f32.store offset=12
          (local.get $d)
          (f32.add
            ;; src[i].x * matrix[3]
            (f32.mul
              (f32.load offset=0
                (local.get $s)
              )
              (local.get $matrix3)
            )
            (f32.add
              ;; src[i].y * matrix[7]
              (f32.mul
                (f32.load offset=4
                  (local.get $s)
                )
                (local.get $matrix7)
              )
              (f32.add
                ;; src[i].z * matrix[11]
                (f32.mul
                  (f32.load offset=8
                    (local.get $s)
                  )
                  (local.get $matrix11)
                )
                ;; src[i].w * matrix[15]
                (f32.mul
                  (f32.load offset=12
                    (local.get $s)
                  )
                  (local.get $matrix15)
                )
              )
            )
          )
        )

        ;; i++
        (local.set $i
          (i32.add
            (local.get $i)
            (i32.const 1)
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
  `