import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TableCell, IconButton, TableRow, TableBody, Table } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CloseIcon from '@mui/icons-material/Close';

const ColumnReOrderPopup = ({ open, handleCloseDialog, handleSaveDialog, draggedColumns, handleColumnOrderChange }) => {
    return (
        <Dialog open={open}>
            <DialogTitle>Set Columns Order
                <IconButton style={{ position: 'absolute', right: 5, top: 5 }} onClick={handleCloseDialog}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ width: "600px" }}>
                <DragDropContext onDragEnd={handleColumnOrderChange}>
                    <Droppable droppableId="droppable" direction="vertical">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <Table>
                                    <TableBody>
                                        {draggedColumns.map((column, index) => (
                                            <Draggable key={column.id} draggableId={`${column.id}-row`} index={index}>
                                                {(provided) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TableCell>
                                                            {column.label}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                    </TableBody>
                                </Table>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-primary btn-sm me-1" onClick={handleSaveDialog} style={{ width: "70px", height: "35px" }}>
                    Save
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ColumnReOrderPopup;
