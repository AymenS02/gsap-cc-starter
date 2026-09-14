import { useState } from "react";

import { DndContext } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

import { menuItems } from "../data/menuItems.js";


const DraggableButton = ({ item }) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: item.id,
  });


  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;


  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="
        text-lg 
        font-bold 
        cursor-grab
        bg-[#6b4f4f] 
        border-2 
        font-mono 
        border-white 
        border-dashed 
        text-gray-200 
        p-4 
        rounded-lg
      "
    >
      {item.name}
    </button>
  );
};


const GsapItemOrder = () => {

  const [items] = useState(menuItems);


  return (
    <DndContext>

      <div className="min-h-screen bg-black p-10">

        <h1 className="mb-8 text-4xl font-bold text-white">
          Menu Editor
        </h1>


        <div className="flex justify-center">

          <div
            className="
              flex 
              justify-center
              mx-auto 
              max-w-3xl 
              space-x-4 
              text-white
            "
          >

            {items.map((item) => (

              <DraggableButton
                key={item.id}
                item={item}
              />

            ))}

          </div>

        </div>

      </div>

    </DndContext>
  );
};


export default GsapItemOrder;