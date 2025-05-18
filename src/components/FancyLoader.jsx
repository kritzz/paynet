import React from "react";
import styled from "styled-components";

const FancyLoader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div className="spinnerin" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .spinner {
    width: 3em;
    height: 3em;
    cursor: not-allowed;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: -10px -10px 10px #f97316, 0px -10px 10px 0px #fd7e14,
      10px -10px 10px #f59e0b, 10px 0 10px #f87171, 10px 10px 10px 0px #ff5500,
      0 10px 10px 0px #ff9500, -10px 10px 10px 0px #fdba74;
    animation: rot55 0.7s linear infinite;
  }

  .spinnerin {
    border: 2px solid #444;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0d0d0d;
  }

  @keyframes rot55 {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default FancyLoader;
