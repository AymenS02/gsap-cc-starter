import { useState, useRef, useLayoutEffect } from "react";

import PropTypes from "prop-types";

import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { menuItems } from "../data/menuItems.js";

import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const DraggableMenuItem = ({ item }) => {

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: item.id,
  });

    
  const {
    setNodeRef: setDropRef,
  } = useDroppable({
    id: item.id,
  });


  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;


  return (
    <button
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
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


DraggableMenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};



const GsapItemOrder = () => {

  const [items, setItems] = useState(menuItems);

  const containerRef = useRef(null);

  const flipState = useRef(null);



  const handleDragEnd = (event) => {

    const {
      active,
      over,
    } = event;


    if (!over) return;


    if (active.id === over.id) return;


    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );


    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    if (!containerRef.current) return;

    flipState.current = Flip.getState(containerRef.current.children);

    const updatedItems = [...items];


    [
      updatedItems[oldIndex],
      updatedItems[newIndex],
    ] = [
      updatedItems[newIndex],
      updatedItems[oldIndex],
    ];


    setItems(updatedItems);

  };

  useLayoutEffect(() => {

    if (!flipState.current) return;

    Flip.from(flipState.current, {
      duration: 4.6,
      ease: "power1.inOut",
    });

    flipState.current = null;

  }, [items]);



  return (

    <DndContext
      onDragEnd={handleDragEnd}
    >

      <div className="min-h-screen bg-black p-10">

        <h1 className="mb-8 text-4xl font-bold text-white">
          Menu Editor
        </h1>


        <div
          className="
            flex
            justify-center
            gap-4
            text-white
            flex-wrap
          "
          ref={containerRef}
        >

          {items.map((item) => (

            <DraggableMenuItem
              key={item.id}
              item={item}
            />

          ))}

        </div>

      </div>

    </DndContext>

  );

};


export default GsapItemOrder;

