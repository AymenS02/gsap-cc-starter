"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { Flip } from "gsap/Flip";

// Register the Flip plugin once so GSAP can use it.
gsap.registerPlugin(Flip);

/**
 * Each square gets its own Tailwind background color.
 * Since the colors are tied to the box object,
 * a square keeps the same color even after shuffling.
 */
const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-400",
  "bg-green-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

/**
 * We always want exactly 10 possible positions
 * around the circle.
 */
const TOTAL_BOXES = 10;

/**
 * Controls how far away each square sits
 * from the center of the circle.
 */
const RADIUS = 180;

const SquaresInCircles = () => {
  /**
   * boxes stores the actual squares.
   *
   * Example:
   *
   * [
   *   {
   *     id: 1,
   *     color: "bg-red-500"
   *   },
   *   {
   *     id: 2,
   *     color: "bg-orange-500"
   *   }
   * ]
   *
   * The ORDER of this array determines
   * where each square appears on the circle.
   */
  const [boxes, setBoxes] = useState([]);

  /**
   * Controls whether the Shuffle button
   * is visible in the center.
   */
  const [showShuffle, setShowShuffle] =
    useState(false);

  /**
   * Stores references to the INNER colored squares.
   *
   * Important:
   *
   * Flip animates the OUTER wrapper.
   *
   * The spawn animation animates the INNER square.
   *
   * Keeping them separate prevents both animations
   * from fighting over the same CSS transform.
   *
   * Example:
   *
   * boxRefs.current[1]
   *
   * points to square #1.
   */
  const boxRefs = useRef({});

  /**
   * Runs when "Add Squares" is clicked.
   *
   * It:
   *
   * 1. Clears any old squares.
   * 2. Hides the Shuffle button.
   * 3. Adds 10 squares one-by-one.
   * 4. Shows the Shuffle button after they finish.
   */
  const spray = () => {
    setBoxes([]);
    setShowShuffle(false);

    /**
     * Spawn one square every 100ms.
     *
     * i = 0 -> immediately
     * i = 1 -> 100ms
     * i = 2 -> 200ms
     * ...
     */
    for (
      let i = 0;
      i < TOTAL_BOXES;
      i++
    ) {
      setTimeout(() => {
        addBox(i);
      }, i * 100);
    }

    /**
     * Wait until the spawning is mostly finished,
     * then reveal the Shuffle button.
     */
    setTimeout(() => {
      setShowShuffle(true);
    }, 1300);
  };

  /**
   * Adds one new square to React state.
   *
   * index determines:
   *
   * - its ID
   * - its color
   */
  const addBox = (index) => {
    setBoxes(
      (previousBoxes) => [
        ...previousBoxes,
        {
          id: index + 1,
          color: colors[index],
        },
      ]
    );
  };

  /**
   * Shuffles the square order.
   *
   * This is where GSAP Flip comes in.
   */
  const shuffle = () => {
    /**
     * STEP 1:
     *
     * Flip takes a snapshot of where
     * every .flip-box currently is.
     *
     * Think:
     *
     * "Square 1 is here."
     * "Square 2 is here."
     * "Square 3 is here."
     */
    const state =
      Flip.getState(".flip-box");

    /**
     * STEP 2:
     *
     * Shuffle the React array.
     *
     * Since each square's POSITION depends
     * on its index in the array,
     * changing the array order changes
     * where each square belongs.
     */
    setBoxes(
      (previousBoxes) => {
        /**
         * Copy the array first.
         *
         * We do NOT want to mutate
         * React state directly.
         */
        const shuffled = [
          ...previousBoxes,
        ];

        /**
         * Fisher-Yates shuffle.
         *
         * This gives us a proper random shuffle.
         */
        for (
          let i =
            shuffled.length - 1;
          i > 0;
          i--
        ) {
          const j = Math.floor(
            Math.random() *
              (i + 1)
          );

          /**
           * Swap shuffled[i]
           * and shuffled[j].
           */
          [
            shuffled[i],
            shuffled[j],
          ] = [
            shuffled[j],
            shuffled[i],
          ];
        }

        return shuffled;
      }
    );

    /**
     * STEP 3:
     *
     * React state updates asynchronously.
     *
     * requestAnimationFrame waits until
     * React has had a chance to render
     * the new layout.
     */
    requestAnimationFrame(() => {
      /**
       * STEP 4:
       *
       * Flip compares:
       *
       * OLD positions
       *
       * vs
       *
       * NEW positions
       *
       * and animates between them.
       */
      Flip.from(state, {
        duration: 0.8,
        ease: "power2.inOut",
      });
    });
  };

  /**
   * Runs every time the boxes array changes.
   *
   * We use this only for the SPAWN animation.
   *
   * Flip does not handle spawning here.
   */
  useLayoutEffect(() => {
    /**
     * If there are no boxes,
     * there is nothing to animate.
     */
    if (boxes.length === 0)
      return;

    /**
     * Get the newest box.
     *
     * Since addBox() always adds to the end,
     * the last array item is the newest square.
     */
    const newestBox =
      boxes[
        boxes.length - 1
      ];

    /**
     * Grab the actual DOM element
     * for that square.
     */
    const element =
      boxRefs.current[
        newestBox.id
      ];

    if (!element) return;

    /**
     * Animate the INNER square only.
     *
     * This controls:
     *
     * - scale
     * - opacity
     *
     * It does NOT control circle position.
     */
    gsap.fromTo(
      element,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );
  }, [boxes]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      {/* =========================
          ADD SQUARES BUTTON
      ========================== */}

      <button
        onClick={spray}
        className="absolute top-10 z-20 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
      >
        Add Squares
      </button>

      {/* =========================
          CIRCLE CONTAINER
      ========================== */}

      <div className="relative h-[500px] w-[500px]">
        {boxes.map(
          (box, index) => {
            /**
             * Each index gets one fixed position
             * around the circle.
             *
             * Since TOTAL_BOXES is always 10,
             * the spacing never changes.
             */
            const angle =
              (index /
                TOTAL_BOXES) *
              Math.PI *
              2;

            /**
             * Convert angle into x/y coordinates.
             *
             * Math.cos() determines horizontal position.
             * Math.sin() determines vertical position.
             */
            const x =
              Math.cos(angle) *
              RADIUS;

            const y =
              Math.sin(angle) *
              RADIUS;

            return (
              /**
               * OUTER WRAPPER
               *
               * This is the element Flip tracks.
               *
               * Its only job is POSITION.
               *
               * Important:
               * Flip should animate this element,
               * NOT the inner colored square.
               */
              <div
                key={box.id}
                data-flip-id={`box-${box.id}`}
                className="flip-box absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  marginLeft: "-35px",
                  marginTop: "-35px",
                }}
              >
                {/**
                 * INNER SQUARE
                 *
                 * This is the visual square.
                 *
                 * It gets:
                 *
                 * - color
                 * - size
                 * - rounded corners
                 * - number
                 *
                 * GSAP's spawn animation
                 * controls its scale and opacity.
                 */}
                <div
                  ref={(
                    element
                  ) => {
                    boxRefs.current[
                      box.id
                    ] = element;
                  }}
                  className={`flex h-[70px] w-[70px] items-center justify-center rounded-xl font-bold text-white ${box.color}`}
                >
                  {box.id}
                </div>
              </div>
            );
          }
        )}

        {/* =========================
            SHUFFLE BUTTON
        ========================== */}

        <button
          onClick={shuffle}
          className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-5 py-4 font-semibold text-black transition-all duration-500 ${
            showShuffle
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-0 opacity-0"
          }`}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
};

export default SquaresInCircles;