export interface LockVersion {
    showAdminKbpwdFlag: boolean;
    groupId: number;
    protocolVersion: number;
    protocolType: number;
    orgId: number;
    logoUrl: string;
    scene: number;
}

export interface SmartDevice {
    date: number;
    lockAlias: string;
    noKeyPwd: string;
    electricQuantityUpdateDate: number;
    lockMac: string;
    passageMode: number;
    lockId: number;
    electricQuantity: number;
    bindDate: number;
    hasGateway: number;
    lockName: string;
    lockVersion: LockVersion;
}

export interface DevicesResponse {
    list: SmartDevice[];
    pageNo: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface LockVersion {
    groupId: number;
    protocolVersion: number;
    protocolType: number;
    orgId: number;
    scene: number;
}

export interface DeviceDetails {
    date: number;
    lockAlias: string;
    lockSound: number;
    modelNum: string;
    lockMac: string;
    privacyLock: number;
    deletePwd: string;
    featureValue: string;
    adminPwd: string;
    soundVolume: number;
    hasGateway: number;
    autoLockTime: number;
    wirelessKeypadFeatureValue: string;
    lockKey: string;
    isFrozen: number;
    lockName: string;
    resetButton: number;
    firmwareRevision: string;
    tamperAlert: number;
    specialValue: number;
    displayPasscode: number;
    noKeyPwd: string;
    passageMode: number;
    passageModeAutoUnlock: number;
    doubleVerification: number;
    timezoneRawOffset: number;
    lockId: number;
    electricQuantity: number;
    lockFlagPos: number;
    lockUpdateDate: number;
    keyboardPwdVersion: number;
    aesKeyStr: string;
    hardwareRevision: string;
    openDirection: number;
    lockVersion: LockVersion;
    sensitivity: number;
}
