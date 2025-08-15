// 设备配置相关类型定义

export interface ModbusField {
  name: string;
  func: number;
  addr: string;
  type: "UInt16" | "Float32" | "Float16" | "Int16" | "Int32";
  format?: "ABCD" | "CDAB" | "BADC" | "DCBA" | null;
  expr?: string | null;
}

export interface Telemetry {
  name: string;
  desc: string;
  group: string;
  addr: number;
  fields: ModbusField[];
}

export interface SendGroup {
  name: string;
  interval: number;
  topics: string[];
  remote: string;
}

export interface RemoteServer {
  name: string;
  broker: string;
  port: number;
  username: string;
  password: string;
  keepalive: number;
  ctrlTopic: string;
}

export interface LocalPort {
  baudrate: number;
  databits: number;
  stopbits: number;
  parity: "none" | "odd" | "even";
}

export interface DeviceConfig {
  telemetries: Telemetry[];
  sendGroups: SendGroup[];
  remotes: RemoteServer[];
  localPort: LocalPort;
}

export interface Device {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
  lastSeen: string;
  sensorsCount: number;
  mqttConnections: number;
  dataRate: string;
  location?: string;
  config?: DeviceConfig;
}

export interface SensorData {
  deviceId: string;
  sensorName: string;
  fieldName: string;
  value: number;
  unit?: string;
  timestamp: string;
  quality: "good" | "bad" | "uncertain";
}