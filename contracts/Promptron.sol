//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

abstract contract Context {
   function _msgSender() internal view virtual returns (address) {
       return msg.sender;
   }

   function _msgData() internal view virtual returns (bytes calldata) {
       this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
       return msg.data;
   }

   function _msgValue() internal view virtual returns (uint256 value) {
       return msg.value;
   }
}

abstract contract Owner is Context {
   address public owner;

   constructor () {
       owner = _msgSender();
   }

   /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(_msgSender() == owner);
        _;
    }

    /**
     * @dev Check if the current caller is the contract owner.
     */
     function isOwner() internal view returns(bool) {
         return owner == _msgSender();
     }
}

contract Promptron is Owner {

   struct Prompt {
       string title;
       string description;
       string category;
       string preview;
       string data;
       uint256 price;
       uint256 used;
       address owner;
   }

   struct Tracking {
       uint256 promptId;
       uint256 startTime;
       address user;
   }

   uint256 public promptId;
   uint256 public trackingId;

   mapping(uint256 => Prompt) public prompts;
   mapping(uint256 => Tracking) public trackings;

   /**
    * @dev Add a Prompt with predefined data
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a {NewPrompt} event.
    */
   function addPrompt(string memory title, string memory description, string memory category, string memory preview, string memory data, uint256 price) public returns (bool success) {
       Prompt memory prompt = Prompt(title, description, category, preview, data, price, 0, _msgSender());

       prompts[promptId] = prompt;

       emit NewPrompt(promptId++);

       return true;
   }

   /**
    * @dev Try a prompt by `_promptId`.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a `NewRental` event.
    */
   function tryPrompt(uint256 _promptId, uint256 startTime) public payable returns (bool) {
       Prompt storage prompt = prompts[_promptId];

       require(_msgValue() >= prompt.price, "Incorrect fund sent.");

       _sendTRX(owner, _msgValue()/5);
       _sendTRX(prompt.owner, _msgValue()*4/5);

       _createTracking(_promptId, startTime);

       emit TryPrompt(_promptId);

       return true;
   }

   /**
    * @dev Delete a prompt. Only the prompt's owner is authorised for this operation.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a `DeletePrompt` event.
    */
   function deletePrompt(uint256 _promptId) public returns(bool success) {
       require(_msgSender() == prompts[_promptId].owner || isOwner(), "You are not authorised to delete this prompt.");

       delete prompts[_promptId];

       emit DeletePrompt(_promptId);

       return true;
   }

   /**
    * @dev Send TRX to the prompt's owner.
    */
   function _sendTRX(address receiver, uint256 value) internal {
       payable(address(uint160(receiver))).transfer(value);
   }

   /**
    * @dev Create a new rental tracking.
    */
   function _createTracking(uint256 _promptId, uint256 startTime) internal {
         trackings[trackingId] = Tracking(_promptId, startTime, _msgSender());

         Prompt storage prompt = prompts[_promptId];

         prompt.used += 1;
   }


   /**
    * @dev Emitted when a new prompt is created.
    * Note `promptId` starts from 0.
    */
   event NewPrompt(uint256 indexed promptId);

   /**
    * @dev Emitted when a prompt is used.
    */
   event TryPrompt(uint256 indexed promptId);


   /**
    * @dev Emitted when a prompt is deleted.
    */
   event DeletePrompt(uint256 indexed promptId);

}
