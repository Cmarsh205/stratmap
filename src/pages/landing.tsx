import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "../App.css";

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to StratMap</h1>
        <p>Your strategic mapping solution</p>
        <Button asChild variant="custom" size="lg">
          <Link to="/stratmaker" className="!text-black !px-4">
            Get Started
          </Link>
        </Button>
      </header>
    </div>
  );
};

export default Landing;
