// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

contract BloodProduction {
    enum BloodPacketStatus {
        NotReady,
        ReadyforDelivery,
        StartDelivery,
        OnTrack,
        EndDelivery,
        Deposited,
        ReadyForSupply,
        OnTrackToHospital,
        EndFinalDelivery,
        Received
    }

    struct BloodPacket {
        address phlebotomist;
        address owner;
        string serialNumber;
        string donorId;
        string collectedDate;
        string collectedLocation;
        BloodPacketStatus status;
    }

    // entities involved
    address public admin; // he is the one who deploys the smart contract
    mapping(address => bool) public phlebotomists;
    address public bloodBankAdmin;
    address public transporter;
    address public distributor;
    address public hospital;

    // bloodPack related state variables
    bytes32[] public allBloodPacketHashes;
    mapping(bytes32 => BloodPacket) public allBloodPackets;
    mapping(bytes32 => string[]) public allLocations;

    // events
    event BloodPacketCreated(bytes32 indexed bloodPacketHash);

    constructor(
        address _phlebotomist,
        address _bloodBankAdmin,
        address _transporter,
        address _distributor,
        address _hospital
    ) {
        admin = msg.sender;
        phlebotomists[_phlebotomist] = true;
        transporter = _transporter;
        bloodBankAdmin = _bloodBankAdmin;
        distributor = _distributor;
        hospital = _hospital;
    }

    // modifiers -- used to restrict entites to perform only specified operations
    modifier onlyPhlebotomist() {
        require(phlebotomists[msg.sender] == true, "You are not Phlebotomist");
        _;
    }

    modifier onlyTransporter() {
        require(msg.sender == transporter, "You are not Transporter");
        _;
    }

    modifier onlyBloodbankAdmin() {
        require(msg.sender == bloodBankAdmin, "You are not bloodbankadmin");
        _;
    }

    modifier onlyDistributor() {
        require(msg.sender == distributor, "You are not distributor");
        _;
    }

    modifier onlyHospital() {
        require(hospital == msg.sender, "You are not hospital admin");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Access Denied. Only Admin");
        _;
    }

    // utility functions
    // this function is used to generate unique hash for bloodPackets
    function concatenateInfoAndHash(
        // a1 : msg.sender,
        // s1 : _serialNumber,
        // s2 : _donorId,
        // s3 : _collectedDate
        address a1,
        string memory s1,
        string memory s2,
        string memory s3
    ) private pure returns (bytes32) {
        //First, get all values as bytes
        bytes20 b_a1 = bytes20(a1);
        bytes memory b_s1 = bytes(s1);
        bytes memory b_s2 = bytes(s2);
        bytes memory b_s3 = bytes(s3);

        //Then calculate and reserve a space for the full string
        string memory s_full = new string(
            b_a1.length + b_s1.length + b_s2.length + b_s3.length
        );
        bytes memory b_full = bytes(s_full);
        uint256 j = 0;
        uint256 i;

        for (i = 0; i < b_a1.length; i++) {
            b_full[j++] = b_a1[i];
        }
        for (i = 0; i < b_s1.length; i++) {
            b_full[j++] = b_s1[i];
        }
        for (i = 0; i < b_s2.length; i++) {
            b_full[j++] = b_s2[i];
        }
        for (i = 0; i < b_s3.length; i++) {
            b_full[j++] = b_s3[i];
        }

        //Hash the result and return
        return keccak256(b_full);
    }

    // main functions start here
    function isPhlebotomist() public view returns (bool) {
        return (phlebotomists[msg.sender] == true);
    }
    
    function getAllBloodPacketHashes() public view returns (bytes32[] memory) {
        return allBloodPacketHashes;
    }

    function getAllBloodPackets(bytes32 bloodPacketHash) public view returns (BloodPacket memory) {
        return allBloodPackets[bloodPacketHash];
    }

    function getAllLocations(bytes32 bloodPacketHash) public view returns (string[] memory) {
        return allLocations[bloodPacketHash];
    }

    function makeBloodPacket(
        string memory _serialNumber,
        string memory _donorId,
        string memory _collectedDate,
        string memory _collectedLocation
    ) public onlyPhlebotomist {
        require(msg.sender != address(0), "Phlebotomist address can't be 0");
        bytes32 bloodPacketHash = concatenateInfoAndHash(msg.sender,_serialNumber,_donorId,_collectedDate);
        // check if hash exists or not
        require(allBloodPackets[bloodPacketHash].phlebotomist == address(0),"BloodPacket already exists");

        BloodPacket memory bloodPacket = BloodPacket(
            msg.sender,
            msg.sender,
            _serialNumber,
            _donorId,
            _collectedDate,
            _collectedLocation,
            BloodPacketStatus.NotReady
        );

        allBloodPacketHashes.push(bloodPacketHash);
        allBloodPackets[bloodPacketHash] = bloodPacket;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_collectedDate,'<->', _collectedLocation)));

        emit BloodPacketCreated(bloodPacketHash);
        // return bloodPacketHash;
    }
    // function updateStatus(bytes32 bloodPacketHash, string memory _date, string memory _location) public {
    //     BloodPacket memory packet = allBloodPackets[bloodPacketHash];
    //     BloodPacketStatus temp = packet.status;
    //     if (temp == BloodPacketStatus.NotReady) {
    //         makeReadyForDelivery(bloodPacketHash);
    //     }
    //     else if (temp == BloodPacketStatus.ReadyforDelivery) {
    //         startDelivery(bloodPacketHash, _date, _location);
    //     } 
    //     else if (temp == BloodPacketStatus.StartDelivery) {
    //         updateDeliveryStatus(bloodPacketHash, _date, _location);
    //     }
    //     else if (temp == BloodPacketStatus.OnTrack) {
    //         endDelivery(bloodPacketHash, _date, _location);
    //     }
    //     else if (temp == BloodPacketStatus.Deposited) {
    //         makeReadyForSupply(bloodPacketHash, _date, _location);
    //     }
    //     else if (temp == BloodPacketStatus.ReadyForSupply) {
    //         startDistribution(bloodPacketHash, _date, _location);
    //     }
    //     else if (temp == BloodPacketStatus.OnTrackToHospital) {
    //         endFinalDelivery(bloodPacketHash, _date, _location);
    //     }
    //     else if (temp == BloodPacketStatus.EndFinalDelivery) {
    //         receivedBloodPacket(bloodPacketHash, _date, _location);
    //     }
    // }

    function makeReadyForDelivery(bytes32 bloodPacketHash) public onlyPhlebotomist {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash]; 
        require(packet.status == BloodPacketStatus.NotReady, "Cannot perform this operation");
        packet.owner = transporter;
        packet.status = BloodPacketStatus.ReadyforDelivery;
        allBloodPackets[bloodPacketHash] = packet;
    }

    function startDelivery(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyTransporter {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash]; 
        require(packet.status == BloodPacketStatus.ReadyforDelivery, "Status is not ReadyForDelivery. Cannot perform this operation");
        packet.status = BloodPacketStatus.StartDelivery;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function updateDeliveryStatus(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyTransporter {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash]; 
        require(packet.status == BloodPacketStatus.StartDelivery, "Status is not StartDelivery. Cannot perform this operation");
        packet.status = BloodPacketStatus.OnTrack;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function endDelivery(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyTransporter {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash]; 
        require(packet.status == BloodPacketStatus.OnTrack, "Status is not OnTrack. Cannot perform this operation");
        packet.owner = bloodBankAdmin;
        packet.status = BloodPacketStatus.Deposited;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function makeReadyForSupply(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyBloodbankAdmin {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash]; 
        require(packet.status == BloodPacketStatus.Deposited, "Status is not Deposited. Cannot perform this operation");
        packet.owner = distributor;
        packet.status = BloodPacketStatus.ReadyForSupply;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function startDistribution(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyDistributor {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash];
        require(packet.status == BloodPacketStatus.ReadyForSupply, "Status is not ReadyForSupply. Cannot perform this operation");
        packet.status = BloodPacketStatus.OnTrackToHospital;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function endFinalDelivery(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyDistributor {
        // require(hospitals[hospital] == true, "Hospital id not recognized. Enter valid hospital address.");
        BloodPacket memory packet = allBloodPackets[bloodPacketHash];
        require(packet.status == BloodPacketStatus.OnTrackToHospital, "Status is not OnTrackToHospital. Cannot perform this operation");
        packet.owner = hospital;
        packet.status = BloodPacketStatus.EndFinalDelivery;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }

    function receivedBloodPacket(
        bytes32 bloodPacketHash,
        string memory _date,
        string memory _location
    ) public onlyHospital {
        BloodPacket memory packet = allBloodPackets[bloodPacketHash];
        require(msg.sender == packet.owner, "You are not owner of this bloodpacket");
        packet.status = BloodPacketStatus.Received;
        allBloodPackets[bloodPacketHash] = packet;
        allLocations[bloodPacketHash].push(string(abi.encodePacked(_date,'<->', _location)));
    }
}
