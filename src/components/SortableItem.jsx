import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id,
    // Prevent dnd-kit from running its own CSS-transition-based
    // "snap into place" animation on drop — GSAP Flip owns that now.
    animateLayoutChanges: () => false,
  });

  const style = {
    // Only the item actively being dragged gets dnd-kit's transform,
    // so it can follow the cursor. Every other item ignores dnd-kit's
    // "make room" preview transform entirely — GSAP Flip is the only
    // thing that moves them, avoiding the double-animation conflict.
    transform: isDragging ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 100 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        menu-item
        bg-zinc-900
        border
        border-zinc-700
        rounded-xl
        p-5
        cursor-grab
        select-none
        active:cursor-grabbing
        shadow-lg
        will-change-transform
        transition-shadow
        duration-200

        ${
          isDragging
            ? `
              opacity-80
              scale-105
              rotate-2
              shadow-2xl
              border-orange-400
            `
            : `
              hover:border-orange-400
            `
        }
      `}
    >
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {item.category}
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {item.name}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            {item.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-orange-400">
            ${item.price.toFixed(2)}
          </p>

          <p
            className={`
              mt-2 text-sm
              ${
                item.available
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >
            {item.available ? "Available" : "Unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;