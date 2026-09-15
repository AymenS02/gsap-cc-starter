import { useState, useRef, useLayoutEffect } from "react";

import PropTypes from "prop-types";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
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

      data-id={item.id}

      ref={(node) => {

        setDragRef(node);
        setDropRef(node);

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

};




const GsapItemOrder = () => {

  const [activeItem, setActiveItem] = useState(null);

  const [items, setItems] = useState(menuItems);

  const activeId = useRef(null);

  // Holds the container DOM element
  const containerRef = useRef(null);


  // Stores Flip snapshot between renders
  const flipState = useRef(null);



  const handleDragEnd = (event) => {


    const {
      active,
      over,
    } = event;



    console.log("Drag ended");



    if (!over) {

      console.log("No drop target");

      return;

    }



    if (active.id === over.id) {

      console.log("Dropped on itself");

      return;

    }



    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );


    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );



    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {

      return;

    }



    if (!containerRef.current) {

      return;

    }



    console.log(
      "Capturing Flip state..."
    );


    flipState.current = Flip.getState(
      containerRef.current.children
    );



    const updatedItems = [...items];



    [
      updatedItems[oldIndex],
      updatedItems[newIndex],

    ] = [

      updatedItems[newIndex],
      updatedItems[oldIndex],

    ];



    console.table(updatedItems);



    setItems(updatedItems);


  };




useLayoutEffect(() => {

  if (!flipState.current) {
    return;
  }


  Flip.from(
    flipState.current,
    {

      duration: 0.6,

      ease: "power3.inOut",

      onComplete() {

        console.log("Flip finished");

        setActiveItem(null);

      },

    }
  );


  flipState.current = null;


}, [items]);




  return (

    <DndContext
      onDragStart={(event) => {

        activeId.current = event.active.id;

        const item = items.find(
          (item) => item.id === event.active.id
        );

        setActiveItem(item);

      }}

      onDragEnd={(event) => {

        handleDragEnd(event);

        setActiveItem(null);

      }}

      onDragCancel={() => {

        setActiveItem(null);

      }}
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

          ref={containerRef}

          className="
            flex
            justify-center
            gap-4
            text-white
            flex-wrap
          "

        >

          {items.map((item) => (

            <DraggableMenuItem

              key={item.id}

              item={item}

            />

          ))}

        </div>


      </div>
      
      <DragOverlay>

        {activeItem ? (

          <button
            className="
              text-lg
              font-bold
              cursor-grabbing
              bg-[#6b4f4f]
              border-2
              font-mono
              border-white
              border-dashed
              text-gray-200
              p-4
              rounded-lg

              shadow-2xl
              scale-110
              rotate-3
              opacity-90
            "
          >
            {activeItem.name}
          </button>

        ) : null}

      </DragOverlay>

    </DndContext>

  );

};


export default GsapItemOrder;