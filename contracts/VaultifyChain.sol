// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VaultifyChain
 * @dev Secure file storage with blockchain verification on BlockDAG
 * @author VaultifyChain Team
 */
contract VaultifyChain {
    // Struct to store file records
    struct FileRecord {
        string fileHash;
        string ipfsCID;
        address uploader;
        address receiver;
        uint256 timestamp;
        bool exists;
    }

    // Struct for access logs
    struct AccessLog {
        address accessor;
        uint256 timestamp;
        string action;
    }

    // Events
    event FileUploaded(
        string indexed fileHash,
        address indexed uploader,
        address indexed receiver,
        string ipfsCID,
        uint256 timestamp
    );

    event FileAccessed(
        string indexed fileHash,
        address indexed accessor,
        uint256 timestamp,
        string action
    );

    event UserAuthorized(
        string indexed fileHash,
        address indexed user,
        address indexed authorizer
    );

    event UserDeauthorized(
        string indexed fileHash,
        address indexed user,
        address indexed authorizer
    );

    // State variables
    mapping(string => FileRecord) public files;
    mapping(string => address[]) public authorizedUsers;
    mapping(string => AccessLog[]) public accessLogs;
    mapping(address => string[]) public userFiles;

    // Modifiers
    modifier onlyFileOwner(string memory _fileHash) {
        require(files[_fileHash].exists, "File does not exist");
        require(files[_fileHash].uploader == msg.sender, "Not the file owner");
        _;
    }

    modifier onlyAuthorizedUser(string memory _fileHash) {
        require(files[_fileHash].exists, "File does not exist");
        require(
            files[_fileHash].uploader == msg.sender || 
            isAuthorizedUser(_fileHash, msg.sender),
            "Not authorized to access this file"
        );
        _;
    }

    /**
     * @dev Upload a file record to the blockchain
     * @param _fileHash SHA-256 hash of the encrypted file
     * @param _ipfsCID IPFS content identifier
     * @param _receiver Address of the intended receiver (0x0 for public)
     */
    function uploadFile(
        string memory _fileHash,
        string memory _ipfsCID,
        address _receiver
    ) public {
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        require(bytes(_ipfsCID).length > 0, "IPFS CID cannot be empty");
        require(!files[_fileHash].exists, "File already exists");

        files[_fileHash] = FileRecord({
            fileHash: _fileHash,
            ipfsCID: _ipfsCID,
            uploader: msg.sender,
            receiver: _receiver,
            timestamp: block.timestamp,
            exists: true
        });

        // Add to user's file list
        userFiles[msg.sender].push(_fileHash);

        // If receiver is specified, authorize them
        if (_receiver != address(0)) {
            authorizedUsers[_fileHash].push(_receiver);
        }

        emit FileUploaded(_fileHash, msg.sender, _receiver, _ipfsCID, block.timestamp);
    }

    /**
     * @dev Log file access
     * @param _fileHash SHA-256 hash of the file
     * @param _action Type of action (download, view, etc.)
     */
    function logAccess(
        string memory _fileHash,
        string memory _action
    ) public onlyAuthorizedUser(_fileHash) {
        require(bytes(_action).length > 0, "Action cannot be empty");

        accessLogs[_fileHash].push(AccessLog({
            accessor: msg.sender,
            timestamp: block.timestamp,
            action: _action
        }));

        emit FileAccessed(_fileHash, msg.sender, block.timestamp, _action);
    }

    /**
     * @dev Authorize a user to access a file
     * @param _fileHash SHA-256 hash of the file
     * @param _user Address of the user to authorize
     */
    function addAuthorizedUser(
        string memory _fileHash,
        address _user
    ) public onlyFileOwner(_fileHash) {
        require(_user != address(0), "Invalid user address");
        require(!isAuthorizedUser(_fileHash, _user), "User already authorized");

        authorizedUsers[_fileHash].push(_user);
        emit UserAuthorized(_fileHash, _user, msg.sender);
    }

    /**
     * @dev Remove authorization for a user
     * @param _fileHash SHA-256 hash of the file
     * @param _user Address of the user to deauthorize
     */
    function removeAuthorizedUser(
        string memory _fileHash,
        address _user
    ) public onlyFileOwner(_fileHash) {
        require(_user != address(0), "Invalid user address");

        address[] storage users = authorizedUsers[_fileHash];
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                users[i] = users[users.length - 1];
                users.pop();
                emit UserDeauthorized(_fileHash, _user, msg.sender);
                break;
            }
        }
    }

    /**
     * @dev Get file record
     * @param _fileHash SHA-256 hash of the file
     * @return FileRecord struct
     */
    function getFileRecord(string memory _fileHash) public view returns (
        string memory,
        string memory,
        address,
        address,
        uint256,
        bool
    ) {
        FileRecord memory record = files[_fileHash];
        return (
            record.fileHash,
            record.ipfsCID,
            record.uploader,
            record.receiver,
            record.timestamp,
            record.exists
        );
    }

    /**
     * @dev Get access logs for a file
     * @param _fileHash SHA-256 hash of the file
     * @return Array of AccessLog structs
     */
    function getAccessLogs(string memory _fileHash) public view returns (
        address[] memory,
        uint256[] memory,
        string[] memory
    ) {
        AccessLog[] memory logs = accessLogs[_fileHash];
        address[] memory accessors = new address[](logs.length);
        uint256[] memory timestamps = new uint256[](logs.length);
        string[] memory actions = new string[](logs.length);

        for (uint256 i = 0; i < logs.length; i++) {
            accessors[i] = logs[i].accessor;
            timestamps[i] = logs[i].timestamp;
            actions[i] = logs[i].action;
        }

        return (accessors, timestamps, actions);
    }

    /**
     * @dev Get authorized users for a file
     * @param _fileHash SHA-256 hash of the file
     * @return Array of authorized user addresses
     */
    function getAuthorizedUsers(string memory _fileHash) public view returns (address[] memory) {
        return authorizedUsers[_fileHash];
    }

    /**
     * @dev Get files uploaded by a user
     * @param _user Address of the user
     * @return Array of file hashes
     */
    function getUserFiles(address _user) public view returns (string[] memory) {
        return userFiles[_user];
    }

    /**
     * @dev Check if a user is authorized to access a file
     * @param _fileHash SHA-256 hash of the file
     * @param _user Address of the user
     * @return True if authorized, false otherwise
     */
    function isAuthorizedUser(string memory _fileHash, address _user) public view returns (bool) {
        if (files[_fileHash].uploader == _user) {
            return true;
        }

        address[] memory users = authorizedUsers[_fileHash];
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get total number of files in the system
     * @return Total file count
     */
    function getTotalFiles() public view returns (uint256) {
        // This is a simplified implementation
        // In production, you might want to maintain a counter
        return 0; // Placeholder - implement based on your needs
    }
}
