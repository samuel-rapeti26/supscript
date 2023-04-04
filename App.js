import { useState } from "react";
import axios from "axios";
import InputComponent from "./components/inputComponent";
import OutputComponent from "./components/outputComponent";
import DictionarieComponent from "./components/dictionarieComponent";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ManualPdf from "./assets/Smart Error Detector Tool_User Manual_V1.0.0.pdf";
import "./style.css";
import { IconButton } from "@mui/material";
import Cookies from "js-cookie";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetCorrectionTable } from "./reducers/correctionTable/CorrectionTableActions";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarItems, setSidebarItems] = useState({
    input: true,
    output: false,
    rules: false,
    userManual: false,
  });
  const [parasContent, setParasContent] = useState([]);
  const [paragraph, setParagraph] = useState("");
  const key1 = Cookies.get("access_token_cookie");
  const key2 = Cookies.get("csrf_access_token");
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;
  const headers1 = {
    // "Accept": "application/json",
    // "Content-Type": "application/json",
    "X-CSRF-TOKEN": key2,
    access_token_cookie: key1,
    Accept: "*/*",
  };

  const { user } = useSelector((state) => state.userReducer);

  const getCorrectionTable = (data) => {
    // console.log("datasplitt", data);
    const payload = { data };
    try {
      setLoading(true);
      axios
        .post("http://localhost:2000/summary", payload, { headers: headers1 })
        .then((response) => {
          const rowdata = Object.keys(response.data.output.Category).map(
            (key) => ({
              id: key,
              error: response.data.output.Error[key],
              suggestion: response.data.output.Suggestion[key],
              errorType: response.data.output.ErrorType[key],
              category: response.data.output.Category[key],
              StartPos: response.data.output.StartPos[key],
              EndPos: response.data.output.EndPos[key],
              Operation: response.data.output.Operation[key],
              FrontendAction: response.data.output.FrontendAction[key],
              ParagraphNum: response.data.output.ParagraphNum[key],
            })
          );
          setParasContent(data);
          dispatch(SetCorrectionTable(rowdata));
          setSidebarItems({
            ...sidebarItems,
            output: true,
            input: false,
          });
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const Proceed = (narrativeFieldValue) => {
    setParagraph(narrativeFieldValue);
    const temp = narrativeFieldValue
      .split("\n")
      .map((text) => text)
      .filter((text) => text !== "\n" && text.trim() !== "");
    getCorrectionTable(temp);
  };

  // console.log("fromapp.js", data);

  const RevertBack = () => {
    setSidebarItems({
      output: false,
      input: true,
      rules: false,
      userManual: false,
    });
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="">
      <header className="py-3 bg-skyblue">
        <div className="px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-center gap-4">
                <h1
                  className="logo font-bold text-white text-2xl text-start text-uppercase cursor-pointer"
                  onClick={RevertBack}
                >
                  Scribe Assist
                </h1>
                <div className="flex p-4 gap-4">
                  {/* <div
                    className={`text-lg text-white cursor-pointer px-2 py-1 rounded-md  ${
                      sidebarItems.input
                        ? "bg-gray-400"
                        : "hover:bg-teal-600 hover:animate-pulse"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: true,
                        output: false,
                        rules: false,
                        userManual: false,
                      })
                    }
                  >
                    Input
                  </div>
                  <div
                    className={`text-lg text-white cursor-pointer px-2 py-1 rounded-md  ${
                      sidebarItems.output
                        ? "bg-gray-400"
                        : "hover:bg-teal-600 hover:animate-pulse"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: true,
                        rules: false,
                        userManual: false,
                      })
                    }
                  >
                    Output
                  </div> */}
                  <div
                    className={`text-lg text-white cursor-pointer py-1 ${
                      sidebarItems.rules
                        ? "bg-gray-400 px-2 border-b-2 border-white "
                        : "hover:bg-teal-600 hover:animate-pulse px-2"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: false,
                        rules: true,
                        userManual: false,
                      })
                    }
                  >
                    Dictionaries & Rule
                  </div>
                  <div
                    className={`text-lg text-white cursor-pointer py-1 ${
                      sidebarItems.userManual
                        ? "bg-gray-400 px-2 border-b-2 border-white "
                        : "hover:bg-teal-600 hover:animate-pulse px-2"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: false,
                        rules: false,
                        userManual: true,
                      })
                    }
                  >
                    User manual
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-white capitalize">{user}</h4>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    className="text-white"
                  >
                    <AccountCircle className="text-white" />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="">
        <div className="flex h-full">
          <div className="w-full px-8 py-4">
            {sidebarItems.input && (
              <InputComponent
                clickProceed={(narrativeFieldValue) =>
                  Proceed(narrativeFieldValue)
                }
              />
            )}
            {sidebarItems.output && (
              <OutputComponent
                clickRevertBack={() => RevertBack()}
                inputData={paragraph}
                parasContent={parasContent}
              />
            )}
            {sidebarItems.rules && (
              <DictionarieComponent clickRevertBack={() => RevertBack()} />
            )}
            {sidebarItems.userManual && (
              <div className="h-screen">
                <object
                  data={ManualPdf}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>
                    Alternative text - include a link{" "}
                    <a href={ManualPdf}>to the PDF!</a>
                  </p>
                </object>
              </div>
            )}
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => {
          console.log("test98");
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
