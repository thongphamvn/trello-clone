import { Input } from "antd";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { useData } from "../DataContext";
import { List } from "../list";

const Container = styled.div`
  display: flex;
  align-items: flex-start;
`;

const InputStyled = styled(Input)`
  margin: 12px;
  width: 250px;
  padding: 4px;
  border: none;
  border-radius: 4px;
`;

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "lightblue" : "",
  display: "flex",
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 4,

  // change background colour if dragging
  // background: isDragging ? "lightgreen" : "transparent",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const BOARD_ID = "board";

export const BoardContent = () => {
  const { list, reorderItem, addNewList, reorderList } = useData();

  const onDragEnd = (res: DropResult) => {
    if (res.source.droppableId === BOARD_ID) {
      return reorderList(res);
    }
    reorderItem(res);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <Droppable droppableId={BOARD_ID} direction="horizontal" type="COLUMN">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {list.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <List list={item} key={item.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <AddNewList onAddNewList={addNewList} />
      </Container>
    </DragDropContext>
  );
};

type AddNewListProps = {
  onAddNewList: (name: string) => void;
};
const AddNewList = ({ onAddNewList }: AddNewListProps) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = () => {
    if (!value) return;
    onAddNewList(value);
    setValue("");
  };

  return (
    <InputStyled
      onChange={(e) => setValue(e.target.value)}
      value={value}
      placeholder="Add new List"
      onBlur={handleSubmit}
      onPressEnter={handleSubmit}
      // suffix={<PlusOutlined />}
      size="large"
    />
  );
};
