pragma solidity 0.5.17;

import "../../../contracts/external/AggregatorV3Interface.sol";

/// @title A mock implementation of a medianizer price oracle.
/// @dev This is used in the Keep testnets only. Mainnet uses the MakerDAO medianizer.
contract MockPriceOracle is AggregatorV3Interface {
    int256 public value;

    constructor() public {
        // solium-disable-previous-line no-empty-blocks
    }

    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (uint80(0), value, uint256(0), uint256(0), uint80(0));
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (uint80(0), value, uint256(0), uint256(0), uint80(0));
    }

    // function getPrice() external view returns (int256 answer) {
    //     return value;
    // }

    function setValue(int256 _value) external {
        value = _value;
    }
}

contract ETHBTCPriceFeedMock is MockPriceOracle {
    // solium-disable-previous-line no-empty-blocks
}
