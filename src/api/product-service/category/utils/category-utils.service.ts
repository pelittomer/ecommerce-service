import { Injectable } from "@nestjs/common";
import { BuildCategoryTreeParams, FindPathToRootParams, ICategoryUtilsService } from "./category-utils.service.interface";

@Injectable()
export class CategoryUtilsService implements ICategoryUtilsService {

    private findPathToRoot(params: FindPathToRootParams): any[] {
        const { categoryMap, currentNode } = params
        const path: any[] = []
        let current = currentNode
        while (current) {
            path.unshift(current)
            if (current.parent) {
                current = categoryMap.get(current.parent.toString())
            } else {
                break
            }
        }
        return [path[0]]
    }

    buildCategoryTree(params: BuildCategoryTreeParams): any[] {
        const { categories, categoryId } = params
        const categoryMap = new Map<string, any>()
        const rootNodes: any[] = []

        // Create a map of categories for efficient lookup
        categories.forEach((cat: any) => {
            categoryMap.set(cat._id.toString(), { ...cat.toObject(), children: [] })
        })

        // Build the tree structure
        categories.forEach((cat: any) => {
            const currentCategory = categoryMap.get(cat._id.toString())
            if (cat.parent) {
                const parentCategory = categoryMap.get(cat.parent.toString())
                if (parentCategory) {
                    parentCategory.children.push(currentCategory)
                }
            } else {
                rootNodes.push(currentCategory)
            }
        })

        // Find the starting node and return the tree
        const startingNode = categoryMap.get(categoryId.toString())
        if (startingNode) {
            return this.findPathToRoot({ currentNode: startingNode, categoryMap })
        }

        return rootNodes
    }
}