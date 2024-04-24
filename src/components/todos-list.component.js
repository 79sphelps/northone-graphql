import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-date-picker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_TODOS, VIEW_TODO, DELETE_ALL } from "../queries";
import { Spinner } from 'reactstrap';
import {
  setTodos,
  // deleteTodos,
  setSearchTitle,
  setCurrentIndex,
  setCurrentTodo,
  setIsFetching,
  getTodosSuccessful,
} from "../redux/actions";
import {
  selectTodos,
  selectCurrentTodo,
  selectCurrentIndex,
  selectSearchTitle,
} from "../redux/selectors";
import { formatDate } from "../redux/utils";

const TodosList = () => {
  const dispatch = useDispatch();
  const datePicker = useRef({ isOpen: true });
  const todos = useSelector(selectTodos);
  const currentTodo = useSelector(selectCurrentTodo);
  const currentIndex = useSelector(selectCurrentIndex);
  const searchTitle = useSelector(selectSearchTitle);

  const getTodos = useQuery(GET_TODOS, {
    onCompleted: data => {
      dispatch(setTodos(data.findAll))
      dispatch(setIsFetching(false))
      dispatch(getTodosSuccessful("Retrieved todos successfully!"))
    }
  });

  const [getTodo] = useLazyQuery(VIEW_TODO, {
    onCompleted: someData => {
      if (!Array.isArray(someData.findOne)) {
        dispatch(setTodos([someData.findOne]));
      } else {
        dispatch(setTodos(someData.findOne));
      }
    }
  });

  // const [deleteAll] = useLazyQuery(DELETE_ALL, {
  //   onCompleted: () => {
  //       dispatch(setTodos([]));
  //   }
  // });
  const [deleteAll] = useMutation(DELETE_ALL, {
    onCompleted: () => dispatch(setTodos([])),
    refetchQueries: [{ query: GET_TODOS }],
  });

  // dispatch(setTodos(getTodos.data.findAll))
  // console.log(JSON.stringify(getTodos.data.findAll, null, 2))

  const mapTodoEventsToCalendar = (arr = []) => {
    const result = arr.map((obj) => {
      const res = {};
      res["title"] = obj["title"];
      res["date"] = formatDate(obj["dueDate"]);
      return res;
    });
    return result;
  };

  const onChangeSearchTitle = (event) => {
    event.preventDefault(); // prevent a browser reload/refresh
    dispatch(setSearchTitle(event.target.value));
  };

  const refreshList = () => {
    // retrieveTodos();
    dispatch(setCurrentTodo(null));
    dispatch(setCurrentIndex(-1));
  };

  const setActiveTodo = (todo, index) => {
    dispatch(setCurrentTodo(todo));
    dispatch(setCurrentIndex(index));
    if (datePicker && datePicker.current && datePicker.current.openCalendar) {
      datePicker.current.openCalendar();
    }
    // localStorage.setItem("currentTodo", JSON.stringify(todo));
    // localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  };

  const removeAllTodos = () => {
    deleteAll({ variables: { id: "" } });
    refreshList();
  };

  const findItemByTitle = () => {
    // dispatch(findByTitle(searchTitle));
    getTodo({variables: { title: searchTitle }})
    // dispatch(setTodos(getTodo({variables: { title: searchTitle }})))
    if (getTodo.loading) return <Spinner color="dark" />;
    if (getTodo.error) return <React.Fragment>Error :(</React.Fragment>;
    dispatch(setCurrentTodo(null));
    // dispatch(setTodos(getTodo.data))
  };

  if (getTodos.loading) {
    dispatch(setIsFetching(true))  
    return <Spinner color="dark" />;
  }
  if (getTodos.error) return <React.Fragment>Error :(</React.Fragment>;

  return (
    <div className="list row">
      <div className="col-md-8" style={{ margin: '0 auto' }}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(searchTitle) => onChangeSearchTitle(searchTitle)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => findItemByTitle()}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>To Do's List</h4>

        <ul className="list-group">
          {todos &&
            todos.map((todo, index) => (
              <li
                className={
                  "list-group-item-action list-group-item " +
                  (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveTodo(todo, index)}
                key={index}
              >
                {todo.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={() => removeAllTodos()}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentTodo ? (
          <div>
            <h4>"To Do" Item</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentTodo.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentTodo.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentTodo.status ? "Done" : "Pending"}
            </div>
            {/* <div>
              <label>
                <strong>Due Date:</strong>
              </label>{" "}
              {currentTodo.dueDate}
            </div> */}
            <div className="form-group">
              <label htmlFor="dueDate">
                <strong>Due Date:</strong>
              </label>{" "}
              <DatePicker
                isOpen={true}
                ref={datePicker}
                value={new Date(currentTodo.dueDate)}
              />
            </div>
            <Link
              to={"/todos/" + currentTodo._id}
              className="btn btn-sm btn-warning"
            >Edit{' '}
              <FontAwesomeIcon icon={faEdit} />
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Click on a "To Do" item to show detailed info</p>
          </div>
        )}
      </div>

      <div className="col-md-12" id="calendar">
        {todos ? (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={mapTodoEventsToCalendar(todos)}
          />
        ) : (
          <div>No "To Do" Events to Show</div>
        )}
      </div>
    </div>
  );
};

export default TodosList;