pragma solidity 0.5.17;

// SPDX-License-Identifier: MIT
contract PriceOracle {
    function latestAnswer() external view returns (int256);
}
