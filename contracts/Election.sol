pragma solidity ^0.5.0;
import "./Verifier.sol";

contract Election is Verifier {

    constructor () public {
        addCandidate("Puwaned");
        addCandidate("Puwadech");
        addCandidate("Suwat");
        addCandidate("Trinet");
    }

    struct Person {
        uint id;
        string name;
        uint score;
    }

    mapping(uint => Person) public candidate;
    uint candidateCount = 0;

    mapping(bytes32 => bool) keyUsed;

    function addCandidate(string memory name) public {
        candidate[candidateCount] = Person(candidateCount,name,0);
    }

    function getScore(uint _id) public view returns (uint) {
        return candidate[_id].score;
    }

    function Vote (uint _candidate_id, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[1] memory input) public {
        bool success = false;
        bytes32 temp = keccak256(abi.encodePacked(a,b,c,input));
        require(keyUsed[temp] != true, "You have voted before...");
        success = verifyTx(a, b, c, input);
        if(success) {
            candidate[_candidate_id].score++;
            keyUsed[temp] = true;
        }
        else {
            revert("Your proof doesn't correct");
        }
    }
}