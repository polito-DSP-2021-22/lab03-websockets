import React, { useState } from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import dayjs from 'dayjs';


const ModalForm = (props) => {
  const { task, onClose, onSave } = props;

  // use controlled form components
  const [description, setDescription] = useState(task ? task.description : '');
  const [isImportant, setIsImportant] = useState(task ? task.important : false);
  const [isPrivate, setIsPrivate] = useState(task ? task.private : true);
  const [deadlineDate, setDeadlineDate] = useState( (task && task.deadline) ? task.deadline.format('YYYY-MM-DD') : '');
  const [deadlineTime, setDeadlineTime] = useState( (task && task.deadline) ? task.deadline.format('HH:mm') : '');
  const [taskProject, setTaskProject] = useState(task ? task.project : null);
  

  // enables / disables react-bootstrap validation report
  const [validated, setValidated] = useState(false);

  // react-bootstrap validation instructions from https://react-bootstrap.github.io/components/forms/#forms-validation
  const handleSubmit = (event) => {
    
    // stop event default and propagation
    event.preventDefault();
    event.stopPropagation(); 

    const form = event.currentTarget; 

    // check if form is valid using HTML constraints
    if (!form.checkValidity()) { 
      setValidated(true); // enables bootstrap validation error report
    } else {
      // we must re-compose the task object from its separated fields
      // deadline propery must be created from the form date and time fields
      // id must be created if already present (edit) not if the task is new

      let deadline;
      if (deadlineDate !== "" && deadlineTime !== "") {
        deadline = dayjs(deadlineDate + "T" + deadlineTime);
      }
      else if (deadlineDate !== "") {
        deadline = dayjs(deadlineDate + "T12:00"); // tasks with no time are due by noon
      }

      const newTask = Object.assign({}, task, { description, important: isImportant, private: isPrivate, deadline} );
      if(taskProject != null) newTask.project = taskProject;

      onSave(newTask);
    }
  }

  const handleDeadlineDate = (ev) => {
      // if date is inserted, set time to noon
      // if date is cacelled, cancel time too
      setDeadlineDate(ev.target.value);
      if (ev.target.value !== "") {
        if (deadlineTime === "") setDeadlineTime("12:00");
      } else {
        setDeadlineTime("");
      }
  }

  const handleDeadlineTime = (ev) => {
      // if time is inserted, set date to today
      // if time is cacelled, cancel date too
      setDeadlineTime(ev.target.value);
      if (ev.target.value !== "") {
        if (deadlineDate === "") setDeadlineDate(dayjs().format('YYYY-MM-DD'));
      } else {
        setDeadlineDate("");
      }
  }

  // noValidate : You can disable the default UI by adding the HTML noValidate attribute to your <Form> or <form> element.
  // Form.Control.Feedback : reports feedback in react-bootstrap style
  // since the modal is added to the page only when needed the show flag can be always true
  return (
    <Modal show onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add task</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="form-description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" name="description" placeholder="Enter description" value={description}
            onChange={(ev) => setDescription(ev.target.value)} required autoFocus />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="form-project">
              <Form.Label>Project</Form.Label>
              <Form.Control type="text" name="project" placeholder="Enter a new task project" value = {taskProject} onChange={(ev) => setTaskProject(ev.target.value)}/>
          </Form.Group>
          <Form.Group controlId="form-is-important">
            <Form.Check custom type="checkbox" label="Important" name="isImportant" checked={isImportant} onChange={(ev) => setIsImportant(ev.target.checked)} />
          </Form.Group>
          <Form.Group controlId="form-is-private">
            <Form.Check custom type="checkbox" label="Private" name="isPrivate" checked={isPrivate} onChange={(ev) => setIsPrivate(ev.target.checked)} />
          </Form.Group>
          <Form.Group controlId="form-deadline-date">
            <Form.Label>Deadline Date</Form.Label>
            <Form.Control type="date" name="deadlineDate" value={deadlineDate} onChange={handleDeadlineDate} />
          </Form.Group>
          <Form.Group controlId="form-deadline-time">
            <Form.Label>Deadline Time</Form.Label>
            <Form.Control type="time" name="deadlineTime" value={deadlineTime} onChange={handleDeadlineTime} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )

}

export default ModalForm;
