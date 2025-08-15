import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Download, Upload, Router } from "lucide-react";
import { DeviceConfig } from "@/types/device";
import { SensorConfig } from "@/components/config/SensorConfig";
import { SendGroupConfig } from "@/components/config/SendGroupConfig";
import { RemoteServerConfig } from "@/components/config/RemoteServerConfig";
import { SerialPortConfig } from "@/components/config/SerialPortConfig";
import { useToast } from "@/hooks/use-toast";

// 模拟设备配置数据
const mockDeviceConfig: DeviceConfig = {
  telemetries: [
    {
      name: "AD130",
      desc: "sensor of temperature and humidity",
      group: "group1",
      addr: 1,
      fields: [
        {
          name: "temp",
          func: 4,
          addr: "0xabcd",
          type: "UInt16",
          format: null,
          expr: "x / 100"
        },
        {
          name: "hum",
          func: 4,
          addr: "0x0a00",
          type: "Float32",
          format: "ABCD",
          expr: "(x + 1) * 10"
        }
      ]
    }
  ],
  sendGroups: [
    {
      name: "group1",
      interval: 1000,
      topics: ["/test/1", "/test/2"],
      remote: "remote1"
    }
  ],
  remotes: [
    {
      name: "remote1",
      broker: "mqtt.example.com",
      port: 1883,
      username: "user",
      password: "pass",
      keepalive: 60,
      ctrlTopic: "/ctrl/1"
    }
  ],
  localPort: {
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
    parity: "none"
  }
};

export default function DeviceConfigPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<DeviceConfig>(mockDeviceConfig);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // 在实际应用中，这里会根据deviceId加载设备配置
    console.log("Loading config for device:", deviceId);
  }, [deviceId]);

  const handleSave = async () => {
    try {
      // 在实际应用中，这里会保存配置到后端
      console.log("Saving config:", config);
      
      toast({
        title: "配置已保存",
        description: `设备 ${deviceId} 的配置已成功保存。`,
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存配置时出现错误，请重试。",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `device-${deviceId}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "配置已导出",
      description: "配置文件已下载到本地。",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          setHasChanges(true);
          toast({
            title: "配置已导入",
            description: "配置文件已成功导入，请检查后保存。",
          });
        } catch (error) {
          toast({
            title: "导入失败",
            description: "配置文件格式错误，请检查文件内容。",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const updateConfig = (updates: Partial<DeviceConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/devices")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回设备列表
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Router className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">设备配置</h1>
              <p className="text-muted-foreground">设备ID: {deviceId}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="mr-2">
              有未保存的更改
            </Badge>
          )}
          
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-config"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-config")?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            导入配置
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            导出配置
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            保存配置
          </Button>
        </div>
      </div>

      {/* 配置概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">传感器数量</p>
                <p className="text-2xl font-bold text-foreground">{config.telemetries.length}</p>
              </div>
              <div className="w-8 h-8 bg-sensor-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xs">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">发送组数量</p>
                <p className="text-2xl font-bold text-foreground">{config.sendGroups.length}</p>
              </div>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-xs">⏱️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">远程服务器</p>
                <p className="text-2xl font-bold text-foreground">{config.remotes.length}</p>
              </div>
              <div className="w-8 h-8 bg-sensor-secondary/10 rounded-lg flex items-center justify-center">
                <span className="text-xs">🌐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">串口波特率</p>
                <p className="text-2xl font-bold text-foreground">{config.localPort.baudrate}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xs">🔌</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 配置选项卡 */}
      <Tabs defaultValue="sensors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">传感器配置</TabsTrigger>
          <TabsTrigger value="groups">发送组配置</TabsTrigger>
          <TabsTrigger value="servers">远程服务器</TabsTrigger>
          <TabsTrigger value="serial">串口配置</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="mt-6">
          <SensorConfig
            telemetries={config.telemetries}
            sendGroups={config.sendGroups}
            onTelemetriesChange={(telemetries) => updateConfig({ telemetries })}
          />
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <SendGroupConfig
            sendGroups={config.sendGroups}
            remoteServers={config.remotes}
            onSendGroupsChange={(sendGroups) => updateConfig({ sendGroups })}
          />
        </TabsContent>

        <TabsContent value="servers" className="mt-6">
          <RemoteServerConfig
            remoteServers={config.remotes}
            onRemoteServersChange={(remotes) => updateConfig({ remotes })}
          />
        </TabsContent>

        <TabsContent value="serial" className="mt-6">
          <SerialPortConfig
            localPort={config.localPort}
            onLocalPortChange={(localPort) => updateConfig({ localPort })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}