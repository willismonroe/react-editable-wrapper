import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const AppContext = createContext(null);

export function EditableWrapper({ children, handleChange }) {
  const [editing, setEditing] = useState(false);
  const input = useRef();

  function changeMode() {
    setEditing(!editing);
  }
  function updateWrapped() {
    setEditing(false);
    handleChange(input.current.value);
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
    return <div onDoubleClick={changeMode}>{children}</div>;
  }

  return editing ? editView() : defaultView();
}

function Name() {
  const { state, setState } = useContext(AppContext);

  return <h2> Hello {state.name}</h2>;
}

function App() {
  const [state, setState] = useState({ name: "<UserName>" });
  const value = useMemo(() => ({ state, setState }), [state, setState]);

  return (
    <div className="App">
      <AppContext.Provider value={value}>
        <EditableWrapper
          handleChange={update => {
            setState({ ...state, name: update });
          }}
        >
          <Name />
        </EditableWrapper>
        <p>Footer -- Logged in as {state.name}</p>
      </AppContext.Provider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
