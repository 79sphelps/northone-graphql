import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { 
  setTodoToAdd, 
  setSubmitted,
  addTodo
} from "../redux/actions";
import { selectTodoToAdd, selectSubmitted } from "../redux/selectors";
import { formatDate } from "../redux/utils";
import { useMutation } from '@apollo/react-hooks';
import { ADD_TODO, GET_TODOS } from "../queries";

const AddTodo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let TodoToAdd = useSelector(selectTodoToAdd);
  const submitted = useSelector(selectSubmitted);
  const [dateValue, onChange] = useState(new Date());

  const [createTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS}]
  });

  if (!TodoToAdd) {
    let todoToAdd = JSON.parse(localStorage.getItem("todoToAdd"));
    if (!todoToAdd) {
      todoToAdd = {
        id: null,
        title: "",
        description: "",
        status: false,
        dueDate: formatDate(new Date()),
      };
      localStorage.setItem("todoToAdd", JSON.stringify(todoToAdd));
    }
    dispatch(setTodoToAdd(todoToAdd));
    TodoToAdd = todoToAdd;
  }

  let initialTodoState = {
    id: null,
    title: "",
    description: "",
    status: false,
    dueDate: formatDate(new Date()),
  };

  const handleInputChange = (event) => {
    event.preventDefault(); // prevent a browser reload/refresh
    const { name, value } = event.target;
    dispatch(setTodoToAdd({ ...TodoToAdd, [name]: value }));
  };

  const saveTodo = () => {
    if (!dateValue) return;
    var data = {
      title: TodoToAdd.title,
      description: TodoToAdd.description,
      status: false,
      dueDate: dateValue,
    };
   
    createTodo({ variables: { id: '', title: data.title, description: data.description, status: data.status, dueDate: data.dueDate }})
    setTimeout(() => {
      dispatch(addTodo(data))
      dispatch(setTodoToAdd(initialTodoState));
      dispatch(setSubmitted(false));
    }, 500)
    // localStorage.removeItem("todoToAdd");
    navigate('/')
  };

  const newTodo = () => {
    dispatch(setTodoToAdd(initialTodoState));
    dispatch(setSubmitted(false));
  };

  return (
    <div className="submit-form">
      {submitted && TodoToAdd ? (
        <div>
          <h4>The new "To Do" item was created successfully!</h4>
          <button className="btn btn-success" onClick={() => newTodo()}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={TodoToAdd && TodoToAdd.title ? TodoToAdd.title : ''}
              onChange={(event) => handleInputChange(event)}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={TodoToAdd && TodoToAdd.description ? TodoToAdd.description : ''}
              onChange={(event) => handleInputChange(event)}
              name="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>{" "}
            <DatePicker onChange={onChange} value={dateValue} />
          </div>

          <button
            onClick={() => saveTodo(TodoToAdd)}
            className="btn btn-success"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTodo;