// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

// Simple ASHA Token with voting
contract ASHA is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("ASHA", "ASHA") ERC20Permit("ASHA") {
        _mint(msg.sender, 1_000_000_000e18); // 1B supply
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

// Simple veASHA Token (staked ASHA)
contract VeASHA is ERC20, ERC20Permit, ERC20Votes {
    ASHA public asha;
    mapping(address => uint256) public lockEnd;

    constructor(address _asha) ERC20("Vote Escrowed ASHA", "veASHA") ERC20Permit("veASHA") {
        asha = ASHA(_asha);
    }

    function stake(uint256 amount, uint256 lockMonths) external {
        require(lockMonths >= 1 && lockMonths <= 48, "Invalid lock");
        asha.transferFrom(msg.sender, address(this), amount);

        // veASHA = ASHA * (1 + lockMonths * 0.1)
        uint256 veAmount = amount * (100 + lockMonths * 10) / 100;
        _mint(msg.sender, veAmount);
        lockEnd[msg.sender] = block.timestamp + lockMonths * 30 days;
    }

    function unstake(uint256 amount) external {
        require(block.timestamp >= lockEnd[msg.sender], "Still locked");
        _burn(msg.sender, amount);
        asha.transfer(msg.sender, amount * 100 / 110); // Approximate conversion back
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

// Simple Governor
contract ParsGovernor {
    struct Proposal {
        uint256 id;
        address proposer;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool canceled;
        bool executed;
        uint256 eta;
    }

    VeASHA public votes;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public constant VOTING_DELAY = 1; // 1 block
    uint256 public constant VOTING_PERIOD = 100; // ~100 blocks for testing
    uint256 public constant QUORUM = 1000e18;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description);
    event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight);

    constructor(address _votes) {
        votes = VeASHA(_votes);
    }

    function propose(string memory description) external returns (uint256) {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.proposer = msg.sender;
        p.startBlock = block.number + VOTING_DELAY;
        p.endBlock = p.startBlock + VOTING_PERIOD;

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function castVote(uint256 proposalId, uint8 support) external {
        Proposal storage p = proposals[proposalId];
        require(block.number >= p.startBlock, "Not started");
        require(block.number <= p.endBlock, "Ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = votes.getVotes(msg.sender);
        hasVoted[proposalId][msg.sender] = true;

        if (support == 0) p.againstVotes += weight;
        else if (support == 1) p.forVotes += weight;
        else p.abstainVotes += weight;

        emit VoteCast(msg.sender, proposalId, support, weight);
    }

    function castVoteWithReason(uint256 proposalId, uint8 support, string memory) external {
        Proposal storage p = proposals[proposalId];
        require(block.number >= p.startBlock, "Not started");
        require(block.number <= p.endBlock, "Ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 weight = votes.getVotes(msg.sender);
        hasVoted[proposalId][msg.sender] = true;

        if (support == 0) p.againstVotes += weight;
        else if (support == 1) p.forVotes += weight;
        else p.abstainVotes += weight;

        emit VoteCast(msg.sender, proposalId, support, weight);
    }

    function state(uint256 proposalId) external view returns (uint8) {
        Proposal storage p = proposals[proposalId];
        if (p.canceled) return 2; // Canceled
        if (p.executed) return 7; // Executed
        if (block.number < p.startBlock) return 0; // Pending
        if (block.number <= p.endBlock) return 1; // Active
        if (p.forVotes <= p.againstVotes) return 3; // Defeated
        if (p.forVotes + p.abstainVotes < QUORUM) return 3; // Defeated (no quorum)
        return 4; // Succeeded
    }

    function queue(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(this.state(proposalId) == 4, "Not succeeded");
        p.eta = block.timestamp + 1 days;
    }

    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.eta, "Timelock");
        p.executed = true;
    }

    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        uint256 eta,
        uint256 startBlock,
        uint256 endBlock,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        bool canceled,
        bool executed
    ) {
        Proposal storage p = proposals[proposalId];
        return (p.proposer, p.eta, p.startBlock, p.endBlock, p.forVotes, p.againstVotes, p.abstainVotes, p.canceled, p.executed);
    }
}

// Deploy script
contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // Deploy ASHA token
        ASHA asha = new ASHA();
        console.log("ASHA deployed:", address(asha));

        // Deploy veASHA
        VeASHA veASHA = new VeASHA(address(asha));
        console.log("veASHA deployed:", address(veASHA));

        // Deploy Governor
        ParsGovernor governor = new ParsGovernor(address(veASHA));
        console.log("Governor deployed:", address(governor));

        // Setup: approve veASHA to spend ASHA, stake some tokens for testing
        asha.approve(address(veASHA), type(uint256).max);
        veASHA.stake(100_000e18, 6); // Stake 100k for 6 months

        // Delegate to self for voting
        veASHA.delegate(deployer);

        // Transfer some ASHA to test accounts
        asha.transfer(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 10_000_000e18);
        asha.transfer(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, 10_000_000e18);

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("ASHA:", address(asha));
        console.log("veASHA:", address(veASHA));
        console.log("Governor:", address(governor));
    }
}
