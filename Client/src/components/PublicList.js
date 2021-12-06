
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isToday from 'dayjs/plugin/isToday';

import { Form, ListGroup } from 'react-bootstrap/';
import { PersonSquare } from 'react-bootstrap-icons';
import Pagination from "react-js-pagination";

dayjs.extend(isYesterday).extend(isToday).extend(isTomorrow);


const formatDeadline = (d) => {
  if (!d) return '--o--';
  else if (d.isToday()) {
    return d.format('[Today at] HH:mm');
  } else if (d.isTomorrow()) {
    return d.format('[Tomorrow at] HH:mm');
  } else if (d.isYesterday()) {
    return d.format('[Yesterday at] HH:mm');
  } else {
    return d.format('dddd DD MMMM YYYY [at] HH:mm');
  }
}

const TaskRowData = (props) => {
  const { task, onCheck } = props;
  const labelClassName = `${task.important ? 'important' : ''} ${task.completed ? 'completed' : ''}`;

  return (
    <>
      <div className="flex-fill m-auto">
        <Form.Group className="m-0" controlId="formBasicCheckbox">
          <Form.Check type="checkbox">
            <Form.Check.Label className={labelClassName} >{task.description}</Form.Check.Label>
          </Form.Check>
        </Form.Group></div>
      <div className="flex-fill mx-2 m-auto"><PersonSquare className={task.private ? 'invisible' : ''} /></div>
      <div className="flex-fill m-auto"><small>{formatDeadline(task.deadline)}</small></div>
    </>
  )
}


const PublicList = (props) => {
  const { tasks, getTasks } = props;


  // handle change event
  const handlePageChange = pageNumber => {
      getTasks(pageNumber);
  }


  return (
    <>
      <ListGroup as="ul" variant="flush">
        {
          tasks.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} className="d-flex w-100 justify-content-between">
                  <TaskRowData task={t} />
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
      <Pagination 
          itemClass="page-item" // add it for bootstrap 4
          linkClass="page-link" // add it for bootstrap 4
          activePage={localStorage.getItem("currentPage")}
          itemsCountPerPage={localStorage.getItem("totalItems")/localStorage.getItem("totalPages")}
          totalItemsCount={localStorage.getItem("totalItems")}
          pageRangeDisplayed={10}
          onChange={handlePageChange}
          pageSize ={localStorage.getItem("totalPages")}
      />
    </>
  )
}

export default PublicList;