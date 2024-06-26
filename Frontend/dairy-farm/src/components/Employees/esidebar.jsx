import React, { useState } from "react";
import NavigationLink from "../NavigationLink";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Link } from "react-router-dom";

function Esidebar() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  return (
    <Box className="sidebar" sx={{ position: 'fixed', left: 0, top: 0 }}>
      <Box className="sidebar-logo-container">
        <img
          className="sidebar-logo"
          src="../../src/assets/sidebar-logo.png"
          alt="Logo"
        />
      </Box>

      {/* Navigation links */}
      <Box className="navigation-links">
        <List>
          <Link to="/employeedashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<SpaceDashboardIcon />}
              text="Dashboard"
              isActive={activeSection === "employeedashboard"}
              onClick={() => handleNavigation("employeedashboard")}
            />
          </Link>
          <Link to="/allemployee" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<PersonAddAlt1Icon />}
              text="Employees"
              isActive={activeSection === "allemployee"}
              onClick={() => handleNavigation("allemployee")}
            />
          </Link>
          <Link to="/task" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<AssignmentIcon />}
              text="Tasks"
              isActive={activeSection === "task"}
              onClick={() => handleNavigation("task")}
            />
          </Link>
          <Link to="/leavedetails" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<AccessTimeFilledIcon />}
              text="Leave"
              isActive={activeSection === "workhours"}
              onClick={() => handleNavigation("workhours")}
            />
          </Link>
          <Link to="/ereport" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<AssessmentIcon />}
              text="Reports"
              isActive={activeSection === "ereport"}
              onClick={() => handleNavigation("ereport")}
            />
          </Link>
        </List>
      </Box>

      {/* Profile and Logout */}
      <Box className="user-actions">
        <List>
          <Link to="/eprofile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NavigationLink
              icon={<AccountCircleIcon />}
              text="Profile"
              isActive={activeSection === "profile"}
              onClick={() => handleNavigation("profile")}
            />
          </Link>
          <Link to="/homeM" style={{ textDecoration: 'none', color: 'inherit' }}>
          <NavigationLink
            icon={<LogoutIcon />}
            text="Logout"
            isActive={activeSection === "logout"}
            onClick={() => handleNavigation("logout")}
          />
          </Link>
        </List>
      </Box>
    </Box>
  );
}

export default Esidebar;
