import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect
} from "react";
import ReactDOM from "react-dom";

const BOX_STYLE = {
  border: "2px solid red",
  margin: "1em",
  padding: "1em",
  display: "inline-block"
};

const AppContext = createContext(null);

export function EditableWrapper({ children, type }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(null);
  const input = useRef();

  function changeMode() {
    setEditing(!editing);
  }

  function updateWrapped() {
    setEditing(false);
    setValue(input.current.value);
  }

  function editView() {
    return (
      <div>
        <input ref={input} />
        <button onClick={updateWrapped}>Ok</button>
        <button onClick={changeMode}>X</button>
      </div>
    );
  }

  function defaultView() {
    return (
      <div onDoubleClick={changeMode}>
        {React.cloneElement(children, { value: value })}
      </div>
    );
  }

  return editing ? editView() : defaultView();
}

function Name(props) {
  const { state, setState } = useContext(AppContext);

  useEffect(() => {
    if (props.value !== null) {
      handleUpdate();
    }
  }, []);

  const handleUpdate = () => {
    if (props.value !== state.name) {
      setState({ ...state, name: props.value });
    }
  };

  return <h2> Hello {state.name}</h2>;
}

function Text(props) {
  const { state, setState } = useContext(AppContext);

  useEffect(() => {
    if (props.value !== null) {
      handleUpdate();
    }
  }, []);

  const handleUpdate = () => {
    if (props.value !== state.text) {
      setState({ ...state, text: props.value });
    }
  };

  return <p>{state.text}</p>;
}

function App() {
  const [state, setState] = useState({
    name: "<UserName>",
    text: "here's some text to edit"
  });
  const value = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <div className="App">
      <AppContext.Provider value={value}>
        <EditableWrapper key="name">
          <Name />
        </EditableWrapper>

        <EditableWrapper key="text">
          <Text />
        </EditableWrapper>
      </AppContext.Provider>

      <div style={BOX_STYLE}>
        <p>Current state:</p>
        <ul>
          <li>state.name: {state.name}</li>
          <li>state.text: {state.text}</li>
        </ul>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
