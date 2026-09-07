export type District = { value: string, label: string }
export type Province = { value: string, label: string, districts: District[] }

export const provinces: Province[] = [
    {
        value: "ha-noi", label: "Hà Nội", districts: [
            { value: "ba-dinh", label: "Ba Đình" },
            { value: "hoan-kiem", label: "Hoàn Kiếm" },
        ]
    },
    {
        value: "hcm", label: "TP. Hồ Chí Minh", districts: [
            { value: "quan-1", label: "Quận 1" },
            { value: "thu-duc", label: "TP. Thủ Đức" },
        ]
    },
];

export function getDistrictsByProvince(provinceValue: string): District[] {
    const provinceFound = provinces.find(p => p.value === provinceValue)
    if (!provinceFound) {
        return [];
    } else {
        return provinceFound.districts;
    }
}