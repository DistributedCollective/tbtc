pragma solidity 0.5.17;

import {SafeMath} from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../external/AggregatorV3Interface.sol";
import "../interfaces/ISatWeiPriceFeed.sol";

/// @notice satoshi/wei price feed.
/// @dev Used ETH/USD medianizer values converted to sat/wei.
contract SatWeiPriceFeed is Ownable, ISatWeiPriceFeed {
    using SafeMath for uint256;

    bool private _initialized = false;
    address internal tbtcSystemAddress;

    AggregatorV3Interface private priceFeed;

    constructor() public {
        // solium-disable-previous-line no-empty-blocks
    }

    /// @notice Initialises the addresses of the ETHBTC price feeds.
    /// @param _tbtcSystemAddress Address of the `TBTCSystem` contract. Used for access control.
    /// @param _SOVBTCPriceFeed The SOVBTC price feed address.
    function initialize(address _tbtcSystemAddress, address _SOVBTCPriceFeed)
        external
        onlyOwner
    {
        require(!_initialized, "Already initialized.");
        tbtcSystemAddress = _tbtcSystemAddress;
        priceFeed = AggregatorV3Interface(_SOVBTCPriceFeed);
        _initialized = true;
    }

    /// @notice Get the current price of 1 satoshi in wei.
    /// @dev This does not account for any 'Flippening' event.
    /// @return The price of one satoshi in wei.
    function getPrice() external view onlyTbtcSystem returns (uint256) {

        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        require(price != 0, "Price feed offline");

        // convert eth/btc to sat/wei
        // We typecast down to uint128, because the first 128 bits of
        // the medianizer value is unrelated to the price.
        return uint(price);
    }

    /// @notice Function modifier ensures modified function is only called by tbtcSystemAddress.
    modifier onlyTbtcSystem() {
        require(
            msg.sender == tbtcSystemAddress,
            "Caller must be tbtcSystem contract"
        );
        _;
    }
}
