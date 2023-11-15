import { Outlet, Navigate } from "react-router-dom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import {
  ExpandLess,
  ExpandMore,
  Event,
  Group,
  LibraryBooks,
  Assessment,
  AccountCircle,
  ExitToApp,
  Add,
  Search,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

const styles = { fontFamily: "Oleo Script", fontSize: "3.4rem" };

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gridTemplateRows: "auto 1fr",
    gridTemplateAreas: `
      "header header"
      "menu content"
    `,
    minHeight: "100vh",
  },
  header: {
    gridArea: "header",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    background: "#DEDEDE",
    padding: theme.spacing(2),
    borderBottom: "1px solid #000000",
    heigth: 128,
  },
  drawer: {
    gridArea: "menu",
    background: "#130663",
    position: "sticky",
    top: 128,
  },
  drawerPaper: { width: 240, background: "#130663", color: "white", top: 81 },
  nested: { paddingLeft: theme.spacing(4) },
  icon: { color: "white" },
  subMenuText: { fontSize: "0.9rem" },
  content: {
    gridArea: "content",
    padding: theme.spacing(2),
  },
  mainMenuItemText: { fontSize: "1.4rem" },
}));

const ContentLayout = () => {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  const [openCitas, setOpenCitas] = React.useState(false);
  const [openPacientes, setOpenPacientes] = React.useState(false);
  const [openHistorias, setOpenHistorias] = React.useState(false);
  const handleClickCitas = () => {
    setOpenCitas(!openCitas);
  };
  const handleClickPacientes = () => {
    setOpenPacientes(!openPacientes);
  };
  const handleClickHistorias = () => {
    setOpenHistorias(!openHistorias);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <>
      {" "}
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>{" "}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      ></link>{" "}
      <link
        href="https://fonts.googleapis.com/css2?family=Oleo+Script&amp;amp;&amp;amp;family=Sofia+Sans:ital,wght@1,100&amp;amp;&amp;amp;display=swap"
        rel="stylesheet"
      ></link>{" "}
      <div className={classes.container}>
        {" "}
        <header className={classes.header}>
          {" "}
          <nav>
            <Link to="/home">
              <h1 style={{ ...styles, fontSize: "2rem" }}>
                {" "}
                <span className="text-indigo-900">Psy</span>nergia{" "}
              </h1>{" "}
            </Link>
          </nav>
        </header>{" "}
        <Drawer
          className={classes.drawer}
          variant="permanent"
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
        >
          {" "}
          <List>
            {" "}
            <ListItem button onClick={handleClickCitas}>
              {" "}
              <ListItemIcon className={classes.icon}>
                {" "}
                <Event />{" "}
              </ListItemIcon>{" "}
              <ListItemText
                primary="Citas"
                classes={{ primary: classes.mainMenuItemText }}
              />{" "}
              {openCitas ? <ExpandLess /> : <ExpandMore />}{" "}
            </ListItem>{" "}
            <Collapse in={openCitas} timeout="auto" unmountOnExit>
              {" "}
              <List component="div" disablePadding>
                {" "}
                <nav>
                  <Link to="/home">
                    <ListItem button className={classes.nested}>
                      {" "}
                      <ListItemIcon className={classes.icon}>
                        {" "}
                        <Add />{" "}
                      </ListItemIcon>{" "}
                      <ListItemText primary="Mis Citas" />{" "}
                    </ListItem>{" "}
                  </Link>
                </nav>
              </List>{" "}
            </Collapse>{" "}
            <ListItem button onClick={handleClickPacientes}>
              {" "}
              <ListItemIcon className={classes.icon}>
                {" "}
                <Group />{" "}
              </ListItemIcon>{" "}
              <ListItemText
                primary="Pacientes"
                classes={{ primary: classes.mainMenuItemText }}
              />{" "}
              {openPacientes ? <ExpandLess /> : <ExpandMore />}{" "}
            </ListItem>{" "}
            <Collapse in={openPacientes} timeout="auto" unmountOnExit>
              {" "}
              <List component="div" disablePadding>
                {" "}
                <nav>
                  <Link to="/home/register-patients">
                    <ListItem button className={classes.nested}>
                      {" "}
                      <ListItemIcon className={classes.icon}>
                        {" "}
                        <Add />{" "}
                      </ListItemIcon>{" "}
                      <ListItemText primary="Registrar Paciente" />{" "}
                    </ListItem>{" "}
                  </Link>

                  <Link to="/home/search-patients">
                    <ListItem button className={classes.nested}>
                      {" "}
                      <ListItemIcon className={classes.icon}>
                        {" "}
                        <Search />{" "}
                      </ListItemIcon>{" "}
                      <ListItemText primary="Pacientes citados" />{" "}
                    </ListItem>{" "}
                  </Link>
                </nav>
              </List>{" "}
            </Collapse>{" "}
            {/* <ListItem button onClick={handleClickHistorias}>
              {" "}
              <ListItemIcon className={classes.icon}>
                {" "}
                <LibraryBooks />{" "}
              </ListItemIcon>{" "}
              <ListItemText
                primary="Historias"
                classes={{ primary: classes.mainMenuItemText }}
              />{" "}
              {openHistorias ? <ExpandLess /> : <ExpandMore />}{" "}
            </ListItem>{" "}
            <Collapse in={openHistorias} timeout="auto" unmountOnExit>
              {" "}
              <List component="div" disablePadding>
                {" "}
                <nav>
                  <Link to="/home/create-history">
                    <ListItem button className={classes.nested}>
                      {" "}
                      <ListItemIcon className={classes.icon}>
                        {" "}
                        <Add />{" "}
                      </ListItemIcon>{" "}
                      <ListItemText primary="Crear Historia" />{" "}
                    </ListItem>{" "}
                  </Link>
                  <Link to="/home/search-history">
                    <ListItem button className={classes.nested}>
                      {" "}
                      <ListItemIcon className={classes.icon}>
                        {" "}
                        <Search />{" "}
                      </ListItemIcon>{" "}
                      <ListItemText primary="Buscar Historia" />{" "}
                    </ListItem>{" "}
                  </Link>
                </nav>
              </List>{" "}
            </Collapse>{" "} */}
            <nav>
              <Link to="/home/stats">
                {/* <ListItem button>
                  {" "}
                  <ListItemIcon className={classes.icon}>
                    {" "}
                    <Assessment />{" "}
                  </ListItemIcon>{" "}
                  <ListItemText
                    primary="Reportes"
                    classes={{ primary: classes.mainMenuItemText }}
                  />{" "}
                </ListItem>{" "} */}
              </Link>
              <Link to="/home/my-profile">
                <ListItem button>
                  {" "}
                  <ListItemIcon className={classes.icon}>
                    {" "}
                    <AccountCircle />{" "}
                  </ListItemIcon>{" "}
                  <ListItemText
                    primary="Mi Perfil"
                    classes={{ primary: classes.mainMenuItemText }}
                  />{" "}
                </ListItem>{" "}
              </Link>
              <Link to="/">
                <ListItem button onClick={handleLogout}>
                  {" "}
                  <ListItemIcon className={classes.icon}>
                    {" "}
                    <ExitToApp />{" "}
                  </ListItemIcon>{" "}
                  <ListItemText
                    primary="Salir"
                    classes={{ primary: classes.mainMenuItemText }}
                  />{" "}
                </ListItem>{" "}
              </Link>
            </nav>
          </List>{" "}
        </Drawer>{" "}
        <main className={classes.content}>
          {" "}
          <Outlet />{" "}
        </main>{" "}
      </div>{" "}
    </>
  );
};
export default ContentLayout;
