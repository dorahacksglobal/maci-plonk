// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import {SnarkCommon} from "./crypto/SnarkCommon.sol";
import {Ownable} from "./Ownable.sol";

/*
 * Stores verifying keys for the circuits.
 * Each circuit has a signature which is its compile-time constants represented
 * as a uint256.
 */
contract VkRegistry is Ownable, SnarkCommon {
    mapping(uint256 => bytes) internal processVks;
    mapping(uint256 => bool) internal processVkSet;

    mapping(uint256 => bytes) internal tallyVks;
    mapping(uint256 => bool) internal tallyVkSet;

    //TODO: event for setVerifyingKeys

    function isProcessVkSet(uint256 _sig) public view returns (bool) {
        return processVkSet[_sig];
    }

    function isTallyVkSet(uint256 _sig) public view returns (bool) {
        return tallyVkSet[_sig];
    }

    function genProcessVkSig(
        uint256 _stateTreeDepth,
        uint256 _voteOptionTreeDepth,
        uint256 _messageBatchSize
    ) public pure returns (uint256) {
        return
            (_messageBatchSize << 192) +
            (_stateTreeDepth << 128) +
            _voteOptionTreeDepth;
    }

    function genTallyVkSig(
        uint256 _stateTreeDepth,
        uint256 _intStateTreeDepth,
        uint256 _voteOptionTreeDepth
    ) public pure returns (uint256) {
        return
            (_stateTreeDepth << 128) +
            (_intStateTreeDepth << 64) +
            _voteOptionTreeDepth;
    }

    function setVerifyingKeys(
        uint256 _stateTreeDepth,
        uint256 _intStateTreeDepth,
        uint256 _messageBatchSize,
        uint256 _voteOptionTreeDepth,
        bytes memory _processVk,
        bytes memory _tallyVk
    ) public onlyOwner {
        uint256 processVkSig = genProcessVkSig(
            _stateTreeDepth,
            _voteOptionTreeDepth,
            _messageBatchSize
        );

        // * DEV *
        // require(processVkSet[processVkSig] == false, "VkRegistry: process vk already set");

        uint256 tallyVkSig = genTallyVkSig(
            _stateTreeDepth,
            _intStateTreeDepth,
            _voteOptionTreeDepth
        );

        // * DEV *
        // require(tallyVkSet[tallyVkSig] == false, "VkRegistry: tally vk already set");

        processVks[processVkSig] = _processVk;

        processVkSet[processVkSig] = true;

        tallyVks[tallyVkSig] = _tallyVk;

        tallyVkSet[tallyVkSig] = true;
    }

    function hasProcessVk(
        uint256 _stateTreeDepth,
        uint256 _voteOptionTreeDepth,
        uint256 _messageBatchSize
    ) public view returns (bool) {
        uint256 sig = genProcessVkSig(
            _stateTreeDepth,
            _voteOptionTreeDepth,
            _messageBatchSize
        );
        return processVkSet[sig];
    }

    function getProcessVkBySig(uint256 _sig)
        public
        view
        returns (bytes memory)
    {
        require(
            processVkSet[_sig] == true,
            "VkRegistry: process verifying key not set"
        );

        return processVks[_sig];
    }

    function getProcessVk(
        uint256 _stateTreeDepth,
        uint256 _voteOptionTreeDepth,
        uint256 _messageBatchSize
    ) public view returns (bytes memory) {
        uint256 sig = genProcessVkSig(
            _stateTreeDepth,
            _voteOptionTreeDepth,
            _messageBatchSize
        );

        return getProcessVkBySig(sig);
    }

    function hasTallyVk(
        uint256 _stateTreeDepth,
        uint256 _intStateTreeDepth,
        uint256 _voteOptionTreeDepth
    ) public view returns (bool) {
        uint256 sig = genTallyVkSig(
            _stateTreeDepth,
            _intStateTreeDepth,
            _voteOptionTreeDepth
        );

        return tallyVkSet[sig];
    }

    function getTallyVkBySig(uint256 _sig) public view returns (bytes memory) {
        require(
            tallyVkSet[_sig] == true,
            "VkRegistry: tally verifying key not set"
        );

        return tallyVks[_sig];
    }

    function getTallyVk(
        uint256 _stateTreeDepth,
        uint256 _intStateTreeDepth,
        uint256 _voteOptionTreeDepth
    ) public view returns (bytes memory) {
        uint256 sig = genTallyVkSig(
            _stateTreeDepth,
            _intStateTreeDepth,
            _voteOptionTreeDepth
        );

        return getTallyVkBySig(sig);
    }
}
