import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Server, Wifi, Eye, EyeOff } from "lucide-react";
import { RemoteServer } from "@/types/device";

interface RemoteServerConfigProps {
  remoteServers: RemoteServer[];
  onRemoteServersChange: (servers: RemoteServer[]) => void;
}

export function RemoteServerConfig({ remoteServers, onRemoteServersChange }: RemoteServerConfigProps) {
  const [editingServer, setEditingServer] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

  const addServer = () => {
    const newServer: RemoteServer = {
      name: "",
      broker: "",
      port: 1883,
      username: "",
      password: "",
      keepalive: 60,
      ctrlTopic: "",
    };
    onRemoteServersChange([...remoteServers, newServer]);
    setEditingServer(remoteServers.length);
  };

  const updateServer = (index: number, updates: Partial<RemoteServer>) => {
    const newServers = [...remoteServers];
    newServers[index] = { ...newServers[index], ...updates };
    onRemoteServersChange(newServers);
  };

  const removeServer = (index: number) => {
    const newServers = remoteServers.filter((_, i) => i !== index);
    onRemoteServersChange(newServers);
    setEditingServer(null);
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const testConnection = async (server: RemoteServer) => {
    // 这里可以实现MQTT连接测试逻辑
    console.log("Testing connection to:", server.broker);
    // 模拟测试
    alert(`正在测试连接到 ${server.broker}:${server.port}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">远程服务器配置</h2>
          <p className="text-muted-foreground">配置MQTT代理服务器连接</p>
        </div>
        <Button onClick={addServer} className="gap-2">
          <Plus className="w-4 h-4" />
          添加服务器
        </Button>
      </div>

      <div className="space-y-4">
        {remoteServers.map((server, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sensor-secondary/10 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-sensor-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {server.name || `服务器 ${index + 1}`}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>地址: {server.broker || "未配置"}</span>
                      <span>端口: {server.port}</span>
                      <span>用户: {server.username || "匿名"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {server.broker && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(server)}
                      className="gap-2"
                    >
                      <Wifi className="w-4 h-4" />
                      测试连接
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setEditingServer(editingServer === index ? null : index)}
                  >
                    {editingServer === index ? "收起" : "配置"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeServer(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingServer === index && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`server-name-${index}`}>服务器名称</Label>
                    <Input
                      id={`server-name-${index}`}
                      value={server.name}
                      onChange={(e) => updateServer(index, { name: e.target.value })}
                      placeholder="例：remote1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`server-broker-${index}`}>MQTT代理地址</Label>
                    <Input
                      id={`server-broker-${index}`}
                      value={server.broker}
                      onChange={(e) => updateServer(index, { broker: e.target.value })}
                      placeholder="例：mqtt.example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`server-port-${index}`}>端口</Label>
                    <Input
                      id={`server-port-${index}`}
                      type="number"
                      value={server.port}
                      onChange={(e) => updateServer(index, { port: parseInt(e.target.value) || 1883 })}
                      min="1"
                      max="65535"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`server-keepalive-${index}`}>保持连接时间 (秒)</Label>
                    <Input
                      id={`server-keepalive-${index}`}
                      type="number"
                      value={server.keepalive}
                      onChange={(e) => updateServer(index, { keepalive: parseInt(e.target.value) || 60 })}
                      min="30"
                      max="300"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`server-username-${index}`}>用户名</Label>
                    <Input
                      id={`server-username-${index}`}
                      value={server.username}
                      onChange={(e) => updateServer(index, { username: e.target.value })}
                      placeholder="MQTT用户名（可选）"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`server-password-${index}`}>密码</Label>
                    <div className="relative">
                      <Input
                        id={`server-password-${index}`}
                        type={showPasswords[index] ? "text" : "password"}
                        value={server.password}
                        onChange={(e) => updateServer(index, { password: e.target.value })}
                        placeholder="MQTT密码（可选）"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility(index)}
                      >
                        {showPasswords[index] ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`server-ctrl-topic-${index}`}>控制主题</Label>
                    <Input
                      id={`server-ctrl-topic-${index}`}
                      value={server.ctrlTopic}
                      onChange={(e) => updateServer(index, { ctrlTopic: e.target.value })}
                      placeholder="例：/ctrl/gateway1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      用于接收远程控制命令的MQTT主题
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">连接配置说明</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">常用端口</h5>
                      <ul className="space-y-1">
                        <li>• 1883: MQTT (非加密)</li>
                        <li>• 8883: MQTT over SSL/TLS</li>
                        <li>• 9001: MQTT over WebSocket</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">注意事项</h5>
                      <ul className="space-y-1">
                        <li>• 保持连接时间建议30-300秒</li>
                        <li>• 控制主题用于远程配置和命令</li>
                        <li>• 建议使用SSL/TLS加密连接</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {remoteServers.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无配置的远程服务器</h3>
            <p className="text-muted-foreground mb-4">添加MQTT代理服务器以发送传感器数据</p>
            <Button onClick={addServer} className="gap-2">
              <Plus className="w-4 h-4" />
              添加服务器
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}