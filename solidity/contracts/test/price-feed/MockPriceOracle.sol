pragma solidity 0.5.17;

import "../../../contracts/external/PriceOracle.sol";

/// @title A mock implementation of a medianizer price oracle.
/// @dev This is used in the Keep testnets only. Mainnet uses the MakerDAO medianizer.
contract MockPriceOracle is PriceOracle {
    int256 public value;

    constructor() public {
        // solium-disable-previous-line no-empty-blocks
    }

    function latestAnswer() external view returns (int256) {
        return value;
    }

    function getPrice() external view returns (int256 answer) {
        return value;
    }

    function setValue(int256 _value) external {
        value = _value;
    }
}

contract ETHBTCPriceFeedMock is MockPriceOracle {
    // solium-disable-previous-line no-empty-blocks
}
