import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Router, Activity, Wifi, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border border-border">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">IoT网关管理平台</h1>
          <p className="text-xl text-muted-foreground mb-6">
            统一管理和配置您的工业物联网网关设备，实时监控传感器数据，优化数据采集和传输策略。
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/devices")}
              className="gap-2"
            >
              <Router className="w-5 h-5" />
              设备管理
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/monitoring")}
              className="gap-2"
            >
              <Activity className="w-5 h-5" />
              数据监控
            </Button>
          </div>
        </div>
      </div>

      {/* 系统概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总设备数</CardTitle>
            <Router className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-status-online">+2 新增设备</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">在线设备</CardTitle>
            <Activity className="h-4 w-4 text-status-online" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-online">9</div>
            <p className="text-xs text-muted-foreground">75% 在线率</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">数据流量</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1.2MB/h</div>
            <p className="text-xs text-status-online">+15% 较昨日</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">活跃传感器</CardTitle>
            <Database className="h-4 w-4 text-sensor-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground">跨9个设备</p>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/devices")}
            >
              <Router className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">设备配置</div>
                <div className="text-sm text-muted-foreground">管理网关和传感器配置</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/monitoring")}
            >
              <Activity className="w-5 h-5 text-status-online" />
              <div className="text-left">
                <div className="font-medium">实时监控</div>
                <div className="text-sm text-muted-foreground">查看传感器数据和状态</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/mqtt")}
            >
              <Wifi className="w-5 h-5 text-accent" />
              <div className="text-left">
                <div className="font-medium">MQTT管理</div>
                <div className="text-sm text-muted-foreground">配置远程服务器连接</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* 系统状态 */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">系统状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIndicator status="online" />
                <span className="text-sm text-foreground">核心服务</span>
              </div>
              <span className="text-xs text-muted-foreground">运行正常</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIndicator status="online" />
                <span className="text-sm text-foreground">数据库连接</span>
              </div>
              <span className="text-xs text-muted-foreground">连接稳定</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIndicator status="warning" />
                <span className="text-sm text-foreground">MQTT代理</span>
              </div>
              <span className="text-xs text-status-warning">部分连接异常</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIndicator status="online" />
                <span className="text-sm text-foreground">API服务</span>
              </div>
              <span className="text-xs text-muted-foreground">响应正常</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近告警 */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-status-warning" />
            最近告警
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-3">
                <StatusIndicator status="warning" size="sm" />
                <div>
                  <div className="text-sm font-medium text-foreground">GW002 - 传感器超时</div>
                  <div className="text-xs text-muted-foreground">生产车间B区 - AD140传感器响应超时</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">15分钟前</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-3">
                <StatusIndicator status="offline" size="sm" />
                <div>
                  <div className="text-sm font-medium text-foreground">GW003 - 设备离线</div>
                  <div className="text-xs text-muted-foreground">仓储区 - 网关连接断开</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2小时前</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <StatusIndicator status="warning" size="sm" />
                <div>
                  <div className="text-sm font-medium text-foreground">MQTT连接异常</div>
                  <div className="text-xs text-muted-foreground">remote2服务器连接不稳定</div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">4小时前</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
