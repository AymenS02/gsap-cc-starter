"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

/* =========================================
   CUBE DATA
========================================= */

const cubes = [
  {
    title: "Frontend",
    description:
      "React, Next.js and modern interfaces.",
    number: "01",
    color: "bg-blue-500",
  },
  {
    title: "Backend",
    description:
      "APIs, databases and server logic.",
    number: "02",
    color: "bg-green-500",
  },
  {
    title: "GSAP",
    description:
      "Interactive animations and motion.",
    number: "03",
    color: "bg-purple-500",
  },
  {
    title: "Design",
    description:
      "Responsive and accessible UI systems.",
    number: "04",
    color: "bg-orange-500",
  },
  {
    title: "React",
    description:
      "Reusable component architecture.",
    number: "05",
    color: "bg-red-500",
  },
  {
    title: "Next.js",
    description:
      "Full-stack React applications.",
    number: "06",
    color: "bg-cyan-500",
  },
  {
    title: "Node",
    description:
      "Scalable JavaScript backends.",
    number: "07",
    color: "bg-emerald-500",
  },
  {
    title: "MongoDB",
    description:
      "Flexible application data.",
    number: "08",
    color: "bg-yellow-500",
  },
  {
    title: "TypeScript",
    description:
      "Safer application development.",
    number: "09",
    color: "bg-indigo-500",
  },
  {
    title: "Tailwind",
    description:
      "Fast and consistent styling.",
    number: "10",
    color: "bg-pink-500",
  },
];

/* =========================================
   SETTINGS
========================================= */

const TOTAL_CUBES = cubes.length;

const CUBE_SIZE = 140;

const HALF_CUBE =
  CUBE_SIZE / 2;

const RADIUS = 330;

const PARALLAX_STRENGTH = 30;

/* =========================================
   COMPONENT
========================================= */

const GsapSandbox = () => {
  const containerRef =
    useRef(null);

  /*
   * Controls whether the cubes
   * have been generated yet.
   */
  const [
    hasStarted,
    setHasStarted,
  ] = useState(false);

  /*
   * OUTER wrappers:
   *
   * Used for circle positioning
   * and shuffle movement.
   */
  const positionRefs =
    useRef([]);

  /*
   * INNER cubes:
   *
   * Used for the 3D flip
   * and mouse parallax.
   */
  const cubeRefs =
    useRef([]);

  /*
   * Current slot occupied
   * by each cube.
   */
  const slotOrderRef =
    useRef(
      Array.from(
        {
          length:
            TOTAL_CUBES,
        },
        (_, index) => index
      )
    );

  /* =========================================
     GET CIRCLE POSITION
  ========================================= */

  const getCirclePosition = (
    slotIndex
  ) => {
    /*
     * Start at the top of the circle.
     */
    const angle =
      (slotIndex /
        TOTAL_CUBES) *
        Math.PI *
        2 -
      Math.PI / 2;

    return {
      x:
        Math.cos(angle) *
        RADIUS,

      y:
        Math.sin(angle) *
        RADIUS,
    };
  };

  /* =========================================
     ADD CUBES
  ========================================= */

  const handleAddCubes = () => {
    setHasStarted(true);
  };

  /* =========================================
     SHUFFLE
  ========================================= */

  const shuffleCubes = () => {
    /*
     * Copy the current slots.
     */
    const newOrder = [
      ...slotOrderRef.current,
    ];

    /*
     * Fisher-Yates shuffle.
     */
    for (
      let i =
        newOrder.length - 1;
      i > 0;
      i--
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
            (i + 1)
        );

      [
        newOrder[i],
        newOrder[
          randomIndex
        ],
      ] = [
        newOrder[
          randomIndex
        ],
        newOrder[i],
      ];
    }

    /*
     * Save new assignments.
     */
    slotOrderRef.current =
      newOrder;

    /*
     * Move every EXISTING cube
     * directly from its current
     * position to its new slot.
     */
    positionRefs.current.forEach(
      (
        wrapper,
        cubeIndex
      ) => {
        if (!wrapper) return;

        const slot =
          newOrder[
            cubeIndex
          ];

        const { x, y } =
          getCirclePosition(
            slot
          );

        gsap.to(wrapper, {
          x,
          y,

          duration: 1,

          ease:
            "power3.inOut",
        });
      }
    );
  };

  /* =========================================
     INITIAL CUBE ANIMATION +
     CUBE INTERACTIONS
  ========================================= */

  useLayoutEffect(() => {
    if (!hasStarted) return;

    const ctx =
      gsap.context(() => {
        /* =====================================
           STARTING ANIMATION

           All cubes begin in the center,
           then spread outward into the circle.
        ===================================== */

        positionRefs.current.forEach(
          (wrapper) => {
            if (!wrapper) return;

            gsap.set(wrapper, {
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
            });
          }
        );

        /*
         * Animate each cube from
         * the center to its circle slot.
         */
        positionRefs.current.forEach(
          (
            wrapper,
            index
          ) => {
            if (!wrapper) return;

            const { x, y } =
              getCirclePosition(
                index
              );

            gsap.to(wrapper, {
              x,
              y,

              scale: 1,

              opacity: 1,

              duration: 1,

              delay:
                index * 0.06,

              ease:
                "power3.out",
            });
          }
        );

        /* =====================================
           SET UP CUBE INTERACTIONS
        ===================================== */

        cubeRefs.current.forEach(
          (cube) => {
            if (!cube) return;

            const cubeDepth =
              cube.offsetWidth;

            const rotation = {
              flip: 0,
              tiltX: 0,
              tiltY: 0,
            };

            let isFlipped =
              false;

            /* ================================
               RENDER CUBE ROTATION
            ================================ */

            function render() {
              gsap.set(cube, {
                rotateX:
                  rotation.flip +
                  rotation.tiltX,

                rotateY:
                  rotation.tiltY,

                z:
                  -cubeDepth /
                  2,
              });
            }

            render();

            /* ================================
               MOUSE ENTER
            ================================ */

            const handleMouseEnter =
              () => {
                isFlipped =
                  false;

                gsap.to(
                  rotation,
                  {
                    flip: 180,

                    duration:
                      0.5,

                    ease:
                      "power2.inOut",

                    overwrite:
                      "flip",

                    onUpdate:
                      render,

                    onComplete:
                      () => {
                        isFlipped =
                          true;
                      },
                  }
                );
              };

            /* ================================
               MOUSE LEAVE
            ================================ */

            const handleMouseLeave =
              () => {
                isFlipped =
                  false;

                gsap.to(
                  rotation,
                  {
                    flip: 0,

                    tiltX: 0,

                    tiltY: 0,

                    duration:
                      0.5,

                    ease:
                      "power2.inOut",

                    overwrite:
                      true,

                    onUpdate:
                      render,
                  }
                );
              };

            /* ================================
               MOUSE MOVE
            ================================ */

            const handleMouseMove =
              (event) => {
                if (
                  !isFlipped
                )
                  return;

                const bounds =
                  cube.getBoundingClientRect();

                const centerX =
                  bounds.left +
                  bounds.width /
                    2;

                const centerY =
                  bounds.top +
                  bounds.height /
                    2;

                const offsetX =
                  (event.clientX -
                    centerX) /
                  bounds.width;

                const offsetY =
                  (event.clientY -
                    centerY) /
                  bounds.height;

                gsap.to(
                  rotation,
                  {
                    tiltX:
                      -offsetY *
                      PARALLAX_STRENGTH,

                    tiltY:
                      offsetX *
                      PARALLAX_STRENGTH,

                    duration:
                      0.3,

                    ease:
                      "power2.out",

                    overwrite:
                      "tilt",

                    onUpdate:
                      render,
                  }
                );
              };

            cube.addEventListener(
              "mouseenter",
              handleMouseEnter
            );

            cube.addEventListener(
              "mouseleave",
              handleMouseLeave
            );

            cube.addEventListener(
              "mousemove",
              handleMouseMove
            );

            cube._cleanup =
              () => {
                cube.removeEventListener(
                  "mouseenter",
                  handleMouseEnter
                );

                cube.removeEventListener(
                  "mouseleave",
                  handleMouseLeave
                );

                cube.removeEventListener(
                  "mousemove",
                  handleMouseMove
                );
              };
          }
        );
      }, containerRef);

    return () => {
      cubeRefs.current.forEach(
        (cube) => {
          if (
            cube?._cleanup
          ) {
            cube._cleanup();
          }
        }
      );

      ctx.revert();
    };
  }, [hasStarted]);

  const buttonRef = useRef(null);

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }
    );
  });

  return () => ctx.revert();
}, []);

  return (
    <div
      ref={containerRef}
      className="
        relative
        h-screen
        w-screen
        overflow-hidden
        bg-neutral-950
        [perspective:2000px]
      "
    >
      {/* =====================================
          BUTTON
      ===================================== */}

      <button
        onClick={
          hasStarted
            ? shuffleCubes
            : handleAddCubes
        }
        className="
          absolute
          left-1/2
          top-8
          z-50
          -translate-x-1/2
          rounded-full
          bg-white
          px-6
          py-3
          font-semibold
          text-black
          transition
          hover:scale-105
        "
      >
        {hasStarted
          ? "Shuffle"
          : "Add Cubes"}
      </button>

      {/* =====================================
          CUBES
      ===================================== */}

      {hasStarted && (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            [transform-style:preserve-3d]
          "
        >

        <button
          ref={buttonRef}
          className="absolute left-1/2 top-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 bg-red-800 transition-all duration-500 hover:scale-105"
        >
          Start
        </button>

          {cubes.map(
            (
              cubeData,
              index
            ) => (
              /*
               * =============================
               * POSITION WRAPPER
               *
               * Shuffle controls this.
               * =============================
               */
              <div
                key={
                  cubeData.number
                }
                ref={(
                  element
                ) => {
                  positionRefs.current[
                    index
                  ] = element;
                }}
                className="
                  absolute
                  left-0
                  top-0
                "
                style={{
                  width:
                    CUBE_SIZE,

                  height:
                    CUBE_SIZE,

                  marginLeft:
                    -HALF_CUBE,

                  marginTop:
                    -HALF_CUBE,
                }}
              >
                {/* ==========================
                    ACTUAL CUBE
                ========================== */}

                <div
                  ref={(
                    element
                  ) => {
                    cubeRefs.current[
                      index
                    ] = element;
                  }}
                  className="
                    relative
                    h-full
                    w-full
                    cursor-pointer
                    [transform-style:preserve-3d]
                  "
                >
                  {/* FRONT */}

                  <div
                    className={`
                      absolute
                      inset-0
                      flex
                      flex-col
                      justify-between
                      border
                      border-white/30
                      p-4
                      text-white
                      ${cubeData.color}
                    `}
                    style={{
                      transform: `translateZ(${HALF_CUBE}px)`,
                    }}
                  >
                    <span className="text-xs opacity-60">
                      {
                        cubeData.number
                      }
                    </span>

                    <div>
                      <h2 className="text-lg font-bold">
                        {
                          cubeData.title
                        }
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-white/70">
                        {
                          cubeData.description
                        }
                      </p>
                    </div>
                  </div>

                  {/* BACK */}

                  <div
                    className={`
                      absolute
                      inset-0
                      flex
                      flex-col
                      justify-between
                      border
                      border-white/30
                      p-4
                      text-white
                      ${cubeData.color}
                    `}
                    style={{
                      transform: `
                        rotateY(180deg)
                        translateZ(${HALF_CUBE}px)
                        rotate(180deg)
                      `,
                    }}
                  >
                    <span className="text-xs opacity-60">
                      {
                        cubeData.number
                      }
                    </span>

                    <div>
                      <h2 className="text-lg font-bold">
                        {
                          cubeData.title
                        }
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-white/70">
                        {
                          cubeData.description
                        }
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      border
                      border-white/20
                      bg-neutral-900
                      text-white/40
                    "
                    style={{
                      transform: `
                        rotateY(90deg)
                        translateZ(${HALF_CUBE}px)
                      `,
                    }}
                  >
                    {
                      cubeData.number
                    }
                  </div>

                  {/* LEFT */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      border
                      border-white/20
                      bg-neutral-900
                      text-white/40
                    "
                    style={{
                      transform: `
                        rotateY(-90deg)
                        translateZ(${HALF_CUBE}px)
                      `,
                    }}
                  >
                    {
                      cubeData.number
                    }
                  </div>

                  {/* TOP */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      border
                      border-white/20
                      bg-neutral-800
                      text-white/40
                    "
                    style={{
                      transform: `
                        rotateX(90deg)
                        translateZ(${HALF_CUBE}px)
                      `,
                    }}
                  >
                    {
                      cubeData.title
                    }
                  </div>

                  {/* BOTTOM */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      border
                      border-white/20
                      bg-neutral-950
                      text-white/40
                    "
                    style={{
                      transform: `
                        rotateX(-90deg)
                        translateZ(${HALF_CUBE}px)
                      `,
                    }}
                  >
                    {
                      cubeData.title
                    }
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GsapSandbox;