import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { LocalPort } from "@/types/device";

interface SerialPortConfigProps {
  localPort: LocalPort;
  onLocalPortChange: (localPort: LocalPort) => void;
}

const baudRates = [
  { value: 1200, label: "1200" },
  { value: 2400, label: "2400" },
  { value: 4800, label: "4800" },
  { value: 9600, label: "9600" },
  { value: 19200, label: "19200" },
  { value: 38400, label: "38400" },
  { value: 57600, label: "57600" },
  { value: 115200, label: "115200" },
];

const dataBits = [
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
];

const stopBits = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
];

const parityOptions = [
  { value: "none", label: "无校验 (None)" },
  { value: "odd", label: "奇校验 (Odd)" },
  { value: "even", label: "偶校验 (Even)" },
];

export function SerialPortConfig({ localPort, onLocalPortChange }: SerialPortConfigProps) {
  const updatePort = (updates: Partial<LocalPort>) => {
    onLocalPortChange({ ...localPort, ...updates });
  };

  const testConnection = () => {
    // 这里可以实现串口连接测试逻辑
    console.log("Testing serial port connection with settings:", localPort);
    alert(`正在测试串口连接 - 波特率: ${localPort.baudrate}, 数据位: ${localPort.databits}, 停止位: ${localPort.stopbits}, 校验: ${localPort.parity}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">串口配置</h2>
          <p className="text-muted-foreground">配置RS485/RS232串口通信参数</p>
        </div>
        <Button onClick={testConnection} variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          测试连接
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            RS485串口参数
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="baudrate">波特率 (bps)</Label>
              <Select
                value={localPort.baudrate.toString()}
                onValueChange={(value) => updatePort({ baudrate: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {baudRates.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="databits">数据位</Label>
              <Select
                value={localPort.databits.toString()}
                onValueChange={(value) => updatePort({ databits: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataBits.map((bits) => (
                    <SelectItem key={bits.value} value={bits.value.toString()}>
                      {bits.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stopbits">停止位</Label>
              <Select
                value={localPort.stopbits.toString()}
                onValueChange={(value) => updatePort({ stopbits: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stopBits.map((bits) => (
                    <SelectItem key={bits.value} value={bits.value.toString()}>
                      {bits.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parity">校验方式</Label>
              <Select
                value={localPort.parity}
                onValueChange={(value: LocalPort["parity"]) => updatePort({ parity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">当前配置</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">波特率:</span>
                <div className="font-medium text-foreground">{localPort.baudrate} bps</div>
              </div>
              <div>
                <span className="text-muted-foreground">数据位:</span>
                <div className="font-medium text-foreground">{localPort.databits} 位</div>
              </div>
              <div>
                <span className="text-muted-foreground">停止位:</span>
                <div className="font-medium text-foreground">{localPort.stopbits} 位</div>
              </div>
              <div>
                <span className="text-muted-foreground">校验:</span>
                <div className="font-medium text-foreground">
                  {parityOptions.find(p => p.value === localPort.parity)?.label}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">配置建议</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>常用配置:</strong> 9600,8,1,None (适用于大多数工业设备)</li>
              <li>• <strong>高速通信:</strong> 115200,8,1,None (适用于快速数据采集)</li>
              <li>• <strong>可靠通信:</strong> 9600,8,1,Even (带校验的稳定连接)</li>
              <li>• <strong>注意:</strong> 所有连接的Modbus设备必须使用相同的串口参数</li>
            </ul>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">连接状态</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-online rounded-full animate-pulse"></div>
                <span className="text-sm text-foreground">串口配置已保存</span>
              </div>
              <span className="text-xs text-muted-foreground">
                配置格式: {localPort.baudrate},{localPort.databits},{localPort.stopbits},{localPort.parity.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}