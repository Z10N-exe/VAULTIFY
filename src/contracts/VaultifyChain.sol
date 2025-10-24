// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultifyChain {
    struct FileRecord {
        string fileHash;
        string ipfsCID;
        address uploader;
        address receiver;
        uint256 timestamp;
        bool exists;
    }

    struct AccessRecord {
        string fileHash;
        address accessor;
        uint256 timestamp;
    }

    // Events
    event FileUploaded(
        string fileHash, 
        address indexed uploader, 
        address indexed receiver, 
        uint256 timestamp
    );
    
    event FileAccessed(
        string fileHash, 
        address indexed accessor, 
        uint256 timestamp
    );
    
    event FileShared(
        string fileHash,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

    // Storage
    mapping(string => FileRecord) public files;
    mapping(string => AccessRecord[]) public accessLogs;
    mapping(address => string[]) public userFiles;
    mapping(address => string[]) public sharedWithUser;

    // Modifiers
    modifier onlyFileOwner(string memory _fileHash) {
        require(files[_fileHash].exists, "File does not exist");
        require(files[_fileHash].uploader == msg.sender, "Not authorized");
        _;
    }

    modifier onlyAuthorizedUser(string memory _fileHash) {
        require(files[_fileHash].exists, "File does not exist");
        require(
            files[_fileHash].uploader == msg.sender || 
            files[_fileHash].receiver == msg.sender,
            "Not authorized to access this file"
        );
        _;
    }

    // Functions
    function uploadFile(
        string memory _fileHash, 
        string memory _ipfsCID, 
        address _receiver
    ) public {
        require(!files[_fileHash].exists, "File already exists");
        require(_receiver != address(0), "Invalid receiver address");
        require(_receiver != msg.sender, "Cannot share with yourself");

        files[_fileHash] = FileRecord({
            fileHash: _fileHash,
            ipfsCID: _ipfsCID,
            uploader: msg.sender,
            receiver: _receiver,
            timestamp: block.timestamp,
            exists: true
        });

        // Update user files
        userFiles[msg.sender].push(_fileHash);
        sharedWithUser[_receiver].push(_fileHash);

        emit FileUploaded(_fileHash, msg.sender, _receiver, block.timestamp);
    }

    function logAccess(string memory _fileHash) public onlyAuthorizedUser(_fileHash) {
        accessLogs[_fileHash].push(AccessRecord({
            fileHash: _fileHash,
            accessor: msg.sender,
            timestamp: block.timestamp
        }));

        emit FileAccessed(_fileHash, msg.sender, block.timestamp);
    }

    function shareFile(string memory _fileHash, address _newReceiver) 
        public 
        onlyFileOwner(_fileHash) 
    {
        require(_newReceiver != address(0), "Invalid receiver address");
        require(_newReceiver != msg.sender, "Cannot share with yourself");
        require(_newReceiver != files[_fileHash].receiver, "Already shared with this address");

        // Update the receiver
        files[_fileHash].receiver = _newReceiver;
        sharedWithUser[_newReceiver].push(_fileHash);

        emit FileShared(_fileHash, msg.sender, _newReceiver, block.timestamp);
    }

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

    function getAccessLogs(string memory _fileHash) public view returns (
        address[] memory,
        uint256[] memory
    ) {
        AccessRecord[] memory logs = accessLogs[_fileHash];
        address[] memory accessors = new address[](logs.length);
        uint256[] memory timestamps = new uint256[](logs.length);

        for (uint i = 0; i < logs.length; i++) {
            accessors[i] = logs[i].accessor;
            timestamps[i] = logs[i].timestamp;
        }

        return (accessors, timestamps);
    }

    function getUserFiles(address _user) public view returns (string[] memory) {
        return userFiles[_user];
    }

    function getSharedWithUser(address _user) public view returns (string[] memory) {
        return sharedWithUser[_user];
    }

    function getFileAccessCount(string memory _fileHash) public view returns (uint256) {
        return accessLogs[_fileHash].length;
    }
}
