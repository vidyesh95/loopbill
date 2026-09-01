'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

import type {ServiceTrendRow} from "@/lib/data/types";

const serviceTrends: ServiceTrendRow[] = [
    {month: 'Nov', services: 420, revenue: 20000},
    {month: 'Dec', services: 450, revenue: 21500},
    {month: 'Jan', services: 200, revenue: 10000},
    {month: 'Feb', services: 220, revenue: 11000},
    {month: 'Mar', services: 250, revenue: 12500},
    {month: 'Apr', services: 230, revenue: 11500},
    {month: 'May', services: 270, revenue: 13500},
    {month: 'Jun', services: 300, revenue: 15000},
    {month: 'Jul', services: 350, revenue: 16500},
    {month: 'Aug', services: 380, revenue: 18000},
    {month: 'Sep', services: 390, revenue: 18500},
    {month: 'Oct', services: 400, revenue: 19000}
];

export default function ServiceTrends({data = serviceTrends}: {data?: ServiceTrendRow[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Trends</CardTitle>
                <CardDescription>Monthly service counts and revenue⟨₹⟩ (Last 1 Year)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.3)"/>
                        <XAxis dataKey="month" stroke="#000000" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis yAxisId="left" stroke="#000000" fontSize={12} tickLine={false} axisLine={false}
                               label={{value: 'Services', angle: -90, position: 'insideLeft', fill: '#000000'}}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#000000" fontSize={12} tickLine={false}
                               axisLine={false}
                               label={{value: 'Revenue⟨₹⟩', angle: 90, position: 'insideRight', fill: '#000000'}}/>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'oklch(97.3% 0.071 103.193)',
                                border: '1px solid oklch(72.3% 0.219 149.579)',
                                borderRadius: '0.5rem'
                            }}
                            labelStyle={{color: 'oklch(72.3% 0.219 149.579)'}}
                            itemStyle={{color: 'oklch(62.3% 0.214 259.815)'}}
                            cursor={{stroke: "oklch(79.5% 0.184 86.047)"}}
                        />
                        <Legend wrapperStyle={{color: 'oklch(72.3% 0.219 149.579)'}}/>
                        <Line yAxisId="left" type="monotone" dataKey="services" stroke="oklch(62.3% 0.214 259.815)"
                              strokeWidth={2} name="Services" dot={{fill: 'oklch(62.3% 0.214 259.815)', r: 4}}
                              activeDot={{r: 6}}/>
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="oklch(72.3% 0.219 149.579)"
                              strokeWidth={2} name="Revenue⟨₹⟩" dot={{fill: 'oklch(72.3% 0.219 149.579)', r: 4}}
                              activeDot={{r: 6}}/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}