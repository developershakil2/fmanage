// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;

        return c;
    }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control functions
 */
contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism
 */
contract Pausable is Ownable {
    bool private _paused;

    event Paused(address account);
    event Unpaused(address account);

    constructor() {
        _paused = false;
    }

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    function paused() public view returns (bool) {
        return _paused;
    }

    function pause() public onlyOwner whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role
 */
contract Roles is Ownable {
    struct Role {
        mapping(address => bool) bearer;
    }

    mapping(string => Role) private roles;

    event RoleGranted(string indexed role, address indexed account, address indexed sender);
    event RoleRevoked(string indexed role, address indexed account, address indexed sender);

    modifier onlyRole(string memory role) {
        require(hasRole(role, msg.sender), "Roles: caller does not have the role");
        _;
    }

    function hasRole(string memory role, address account) public view returns (bool) {
        return roles[role].bearer[account];
    }

    function grantRole(string memory role, address account) public onlyOwner {
        _grantRole(role, account);
    }

    function revokeRole(string memory role, address account) public onlyOwner {
        _revokeRole(role, account);
    }

    function _grantRole(string memory role, address account) internal {
        roles[role].bearer[account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function _revokeRole(string memory role, address account) internal {
        roles[role].bearer[account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }
}

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


/**
 * @title TokenConversion
 * @dev Token and coin management with deposit, withdrawal, conversion, and more functionalities
 */
contract FundsArrangement is Ownable, Pausable, Roles {
    using SafeMath for uint256;

    uint256 public tokenBalance;
    uint256 public coinBalance;
    uint256 public conversionRateToTokens = 100; // 1 coin = 100 tokens
    uint256 public conversionRateToCoins = 75;  // 100 tokens = 1.33 coins (1 token = 1/75 coins)
    uint256 public FeeRate = 0.0 ether;
    struct Transaction {
        uint256 amount;
        string currency;
        string transactionType;
        uint256 timestamp;
    }
     struct UserStore{
        address user;
        uint256 amount;
        string currency;
        string transactionType;
        uint256 timestamp;
     }
   
    UserStore[] public userStore;

    mapping(address => uint256) public tokenBalances;
    mapping(address => uint256) public coinBalances;
    mapping(address => Transaction[]) public transactionHistory;
    mapping(address => bool) private frozenAccounts;

    event Deposit(address indexed user, uint256 amount, string currency, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, string currency, uint256 timestamp);
    event ConvertToTokens(address indexed user, uint256 amount, uint256 tokensReceived, uint256 timestamp);
    event ConvertToCoins(address indexed user, uint256 amount, uint256 coinsReceived, uint256 timestamp);
    event AccountFrozen(address indexed account);
    event AccountUnfrozen(address indexed account);

    modifier notFrozen(address account) {
        require(!frozenAccounts[account], "Account is frozen");
        _;
    }
    

  // Function to deposit ERC20 tokens
    function depositTokens(uint256 amount, IERC20 _token) external  whenNotPaused notFrozen(msg.sender){
        require(amount > 0, "Amount must be greater than zero");
        require(IERC20(_token).approve(address(this), amount), "Token approval failed");
        require(IERC20(_token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        tokenBalances[msg.sender] = tokenBalances[msg.sender].add(amount);
        tokenBalance = tokenBalance.add(amount);
        _recordTransaction(msg.sender, amount, "tokens", "deposit");
        emit Deposit(msg.sender, amount, "tokens", block.timestamp);
        userStore.push(UserStore(msg.sender, amount, "tokens", "deposit", block.timestamp));
    }


 // Function to deposit native coins (Eth or bnb or matic or any evm native coin )
    function depositCoins() external payable whenNotPaused notFrozen(msg.sender) {
        require(msg.value > 0, "Amount must be greater than zero");
        coinBalances[msg.sender] = coinBalances[msg.sender].add(msg.value);
        coinBalance = coinBalance.add(msg.value);
        _recordTransaction(msg.sender, msg.value, "coins", "deposit");
        emit Deposit(msg.sender, msg.value, "coins", block.timestamp);
        userStore.push(UserStore(msg.sender, msg.value, "coins", "deposit", block.timestamp));
    }

    // Functions related to withdrawals
    function withdrawTokens(uint256 amount, IERC20 _token) external whenNotPaused notFrozen(msg.sender)  {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        require(IERC20(_token).transferFrom(address(this), msg.sender, amount));
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(amount);
        tokenBalance = tokenBalance.sub(amount);
        _recordTransaction(msg.sender, amount, "tokens", "withdraw");
        emit Withdraw(msg.sender, amount, "tokens", block.timestamp);
        userStore.push(UserStore(msg.sender, amount, "tokens", "withdraw", block.timestamp));
    }

    function withdrawCoins() payable external  whenNotPaused notFrozen(msg.sender) {
        require(msg.value > 0, "Amount must be greater than zero");
        require(coinBalances[msg.sender] >= msg.value, "Insufficient coin balance");
         require(address(this).balance >= msg.value, "Insufficient Ether balance in the contract");
        coinBalances[msg.sender] = coinBalances[msg.sender].sub(msg.value);
        coinBalance = coinBalance.sub(msg.value);
        payable(msg.sender).transfer(msg.value);
        _recordTransaction(msg.sender, msg.value, "coins", "withdraw");
        emit Withdraw(msg.sender, msg.value, "coins", block.timestamp);
       userStore.push(UserStore(msg.sender, msg.value, "tokens", "withdraw", block.timestamp));
    }


    // Functions related to conversions
    function convertToTokens(uint256 amount) external whenNotPaused notFrozen(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(coinBalances[msg.sender] >= amount, "Insufficient coin balance");
        uint256 tokens = amount.mul(conversionRateToTokens);
        coinBalances[msg.sender] = coinBalances[msg.sender].sub(amount);
        tokenBalances[msg.sender] = tokenBalances[msg.sender].add(tokens);
        coinBalance = coinBalance.sub(amount);
        tokenBalance = tokenBalance.add(tokens);
        _recordTransaction(msg.sender, amount, "coins", "convertToTokens");
        emit ConvertToTokens(msg.sender, amount, tokens, block.timestamp);
        userStore.push(UserStore(msg.sender, amount, "coins", "convertToTokens", block.timestamp));
    }

    function convertToCoins(uint256 amount) external whenNotPaused notFrozen(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        uint256 coins = amount.div(conversionRateToCoins);
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(amount);
        coinBalances[msg.sender] = coinBalances[msg.sender].add(coins);
        tokenBalance = tokenBalance.sub(amount);
        coinBalance = coinBalance.add(coins);
        _recordTransaction(msg.sender, amount, "tokens", "convertToCoins");
        emit ConvertToCoins(msg.sender, amount, coins, block.timestamp);
        userStore.push(UserStore(msg.sender, amount, "tokens", "convertToCoins", block.timestamp));
    }

    // Owner functions to set conversion rates
    function setConversionRateToTokens(uint256 newRate) public onlyOwner {
        conversionRateToTokens = newRate;
    }

    function setConversionRateToCoins(uint256 newRate) public onlyOwner {
        conversionRateToCoins = newRate;
    }

    // Function to get transaction history
    function getTransactionHistory(address user) external view returns (Transaction[] memory) {
        return transactionHistory[user];
    }

    // Internal function to record transactions
    function _recordTransaction(address user, uint256 amount, string memory currency, string memory transactionType) internal {
        transactionHistory[user].push(Transaction({
            amount: amount,
            currency: currency,
            transactionType: transactionType,
            timestamp: block.timestamp
        }));
        payable(owner).transfer(FeeRate);
    }
    function setFeeRate(uint256 _rate) public onlyOwner{
        FeeRate = _rate;
    }

    // Freezing and unfreezing accounts
    function freezeAccount(address account) public onlyOwner {
        frozenAccounts[account] = true;
        emit AccountFrozen(account);
    }

    function unfreezeAccount(address account) public onlyOwner {
        frozenAccounts[account] = false;
        emit AccountUnfrozen(account);
    }


    function burnTokensUsers(uint256 amount) external whenNotPaused notFrozen(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(amount);
        tokenBalance = tokenBalance.sub(amount);
        _recordTransaction(msg.sender, amount, "tokens", "burn");
        userStore.push(UserStore(msg.sender, amount, "tokens", "burn", block.timestamp));
    }

    function burnCoinsUsers(uint256 amount) external whenNotPaused notFrozen(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(coinBalances[msg.sender] >= amount, "Insufficient coin balance");
        coinBalances[msg.sender] = coinBalances[msg.sender].sub(amount);
        coinBalance = coinBalance.sub(amount);
        _recordTransaction(msg.sender, amount, "coins", "burn");
        userStore.push(UserStore(msg.sender, amount, "coins", "burn", block.timestamp));
    }
    // Enhanced transaction history with pagination
    function transHistory(address user, uint256 page, uint256 pageSize) external view returns (Transaction[] memory) {
        uint256 totalTransactions = transactionHistory[user].length;
        uint256 start = page * pageSize;
        uint256 end = start + pageSize;
        if (end > totalTransactions) {
            end = totalTransactions;
        }
        require(start < totalTransactions, "Page out of range");

        Transaction[] memory transactions = new Transaction[](end - start);
        for (uint256 i = start; i < end; i++) {
            transactions[i - start] = transactionHistory[user][i];
        }
        return transactions;
    }

    // Delegation feature
    mapping(address => mapping(address => bool)) private delegations;

    event DelegationGranted(address indexed delegator, address indexed delegatee);
    event DelegationRevoked(address indexed delegator, address indexed delegatee);

    modifier onlyDelegatorOrDelegatee(address delegator) {
        require(
            msg.sender == delegator || delegations[delegator][msg.sender],
            "Caller is neither the delegator nor a delegatee"
        );
        _;
    }

    function grantDelegation(address delegatee) external {
        delegations[msg.sender][delegatee] = true;
        emit DelegationGranted(msg.sender, delegatee);
    }

    function revokeDelegation(address delegatee) external {
        delegations[msg.sender][delegatee] = false;
        emit DelegationRevoked(msg.sender, delegatee);
    }

    // Override existing functions to include delegation check
    function transferTokens(address to, uint256 amount) external onlyDelegatorOrDelegatee(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(tokenBalances[msg.sender] >= amount, "Insufficient token balance");
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(amount);
        tokenBalances[to] = tokenBalances[to].add(amount);
        _recordTransaction(msg.sender, amount, "tokens", "transfer");
        _recordTransaction(to, amount, "tokens", "receive");
        userStore.push(UserStore(msg.sender, amount, "tokens", "transfer", block.timestamp));
        userStore.push(UserStore(to, amount, "tokens", "receive", block.timestamp));
    }

    function transferCoins(address to, uint256 amount) external onlyDelegatorOrDelegatee(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(coinBalances[msg.sender] >= amount, "Insufficient coin balance");
        coinBalances[msg.sender] = coinBalances[msg.sender].sub(amount);
        coinBalances[to] = coinBalances[to].add(amount);
        _recordTransaction(msg.sender, amount, "coins", "transfer");
        userStore.push(UserStore(msg.sender, amount, "tokens", "transfer", block.timestamp));
        _recordTransaction(to, amount, "coins", "receive");
        userStore.push(UserStore(to, amount, "coins", "receive", block.timestamp));
    }
    function getTransRecords() public view returns(UserStore[] memory){
        return userStore;
    }

    // Adding comments and detailed documentation
    /**
     * @dev Constructor initializes the contract with the initial owner.
     */
    constructor() Ownable() {}

    /**
     * @dev Fallback function to accept ether.
     */
    receive() external payable {}

    /**
     * @dev Function to withdraw ether from the contract.
     */
    function withdrawNativeCoin(uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient ether balance");
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Function to get the ether balance of the contract.
     */
    function getNativeCoinBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Function to get the token balance of the contract.
     */
    function getTokenBalance() external view returns (uint256) {
        return tokenBalance;
    }

    /**
     * @dev Function to get the coin balance of the contract.
     */
    function getCoinBalance() external view returns (uint256) {
        return coinBalance;
    }

    /**
     * @dev Function to get the token balance of a user.
     */
    function getTokenBalanceOf(address user) external view returns (uint256) {
        return tokenBalances[user];
    }

    /**
     * @dev Function to get the coin balance of a user.
     */
    function getCoinBalanceOf(address user) external view returns (uint256) {
        return coinBalances[user];
    }
}
