pragma solidity 0.5.17;

import {SafeMath} from "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../external/PriceOracle.sol";
import "../interfaces/ISatWeiPriceFeed.sol";

/// @notice satoshi/wei price feed.
/// @dev Used ETH/USD medianizer values converted to sat/wei.
contract SatWeiPriceFeed is Ownable, ISatWeiPriceFeed {
    using SafeMath for uint256;

    bool private _initialized = false;
    address internal tbtcSystemAddress;

    PriceOracle private priceFeed;

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
        priceFeed = PriceOracle(_SOVBTCPriceFeed);
        _initialized = true;
    }

    /// @notice Get the current price of 1 BTC in usd.
    /// @dev This does not account for any 'Flippening' event.
    /// @return The price of one BTC in usd.
    function getPrice() external view onlyTbtcSystem returns (uint256) {
        int256 price = priceFeed.latestAnswer();

        require(price != 0, "Price feed offline");
        // TODO
        return uint256(price);
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
