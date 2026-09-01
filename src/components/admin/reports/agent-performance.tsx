'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

import type {AgentPerformanceRow} from "@/lib/data/types";

const agentPerformance: AgentPerformanceRow[] = [
    {name: 'Agent A', servicesCompleted: 30, efficiency: 95},
    {name: 'Agent B', servicesCompleted: 25, efficiency: 90},
    {name: 'Agent C', servicesCompleted: 28, efficiency: 92},
    {name: 'Agent D', servicesCompleted: 35, efficiency: 98},
    {name: 'Agent E', servicesCompleted: 22, efficiency: 85},
    {name: 'Agent F', servicesCompleted: 37, efficiency: 85},
];

export default function AgentPerformance({data = agentPerformance}: {data?: AgentPerformanceRow[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Top performing agents this month by services completed and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={"rgba(0, 0, 0, 0.3)"}/>
                        <XAxis dataKey="name" stroke="#000000" fontSize={12} tickLine={false}
                               axisLine={false}/>
                        <YAxis yAxisId="left" stroke="#000000" fontSize={12} tickLine={false}
                               axisLine={false} label={{
                            value: 'Services Completed',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#000000'
                        }}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#000000" fontSize={12}
                               tickLine={false} axisLine={false} label={{
                            value: 'Efficiency (%)',
                            angle: 90,
                            position: 'insideRight',
                            fill: '#000000'
                        }}/>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'oklch(97.3% 0.071 103.193)',
                                border: '1px solid #ffff00',
                                borderRadius: '0.5rem'
                            }}
                            labelStyle={{color: 'oklch(72.3% 0.219 149.579)'}}
                            itemStyle={{color: 'oklch(62.3% 0.214 259.815)'}}
                            cursor={{fill: "rgba(0, 0, 0, 0.2)"}}
                        />
                        <Legend wrapperStyle={{color: '#000000'}}/>
                        <Bar yAxisId="left" dataKey="servicesCompleted" fill="oklch(62.3% 0.214 259.815)"
                             name="Services Completed" radius={[4, 4, 0, 0]}/>
                        <Bar yAxisId="right" dataKey="efficiency" fill="oklch(72.3% 0.219 149.579)" name="Efficiency (%)"
                             radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}