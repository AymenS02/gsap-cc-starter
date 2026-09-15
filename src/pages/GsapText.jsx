// This is a copy with gsap animation added
import { useState, useLayoutEffect, useRef } from "react";

import PropTypes from "prop-types";

import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import gsap from "gsap";
import { Flip } from "gsap/Flip";

import { menuItems } from "../data/menuItems.js";


gsap.registerPlugin(Flip);



const DraggableMenuItem = ({ item, itemRef }) => {

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
  } = useDraggable({
    id: item.id,
  });


  const {
    setNodeRef: setDropRef,
  } = useDroppable({
    id: item.id,
  });


  return (
    <button
      ref={(node) => {

        setDragRef(node);
        setDropRef(node);

        if (node) {
          itemRef.current[item.id] = node;
        }

      }}
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

  itemRef: PropTypes.object.isRequired,
};





const GsapItemOrder = () => {


  const [items, setItems] = useState(menuItems);


  const itemRefs = useRef({});



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



    const state = Flip.getState(
      Object.values(itemRefs.current)
    );



    const updatedItems = [...items];



    [
      updatedItems[oldIndex],
      updatedItems[newIndex],
    ] = [
      updatedItems[newIndex],
      updatedItems[oldIndex],
    ];



    setItems(updatedItems);



    requestAnimationFrame(() => {

      Flip.from(state, {

        duration: 0.6,

        ease: "power3.inOut",

      });

    });


  };




  return (

    <DndContext
      onDragEnd={handleDragEnd}
    >

      <div
        className="
          min-h-screen
          bg-black
          p-10
        "
      >

        <h1
          className="
            mb-8
            text-4xl
            font-bold
            text-white
          "
        >
          Menu Editor
        </h1>



        <div
          className="
            flex
            justify-center
            gap-4
            text-white
          "
        >

          {items.map((item) => (

            <DraggableMenuItem

              key={item.id}

              item={item}

              itemRef={itemRefs}

            />

          ))}


        </div>


      </div>


    </DndContext>

  );

};



export default GsapItemOrder;