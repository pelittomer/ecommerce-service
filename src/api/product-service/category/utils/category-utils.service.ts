import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { CategoryDocument } from "../schemas/category.schema";

@Injectable()
export class CategoryUtilsService {

    private findPathToRoot(currentNode: any, categoryMap: Map<string, any>): any[] {
        const path: any[] = []

        while (currentNode) {
            path.unshift(currentNode)
            if (currentNode.parent) {
                currentNode = categoryMap.get(currentNode.parent.toString())
            } else {
                break
            }
        }
        return [path[0]]
    }

    buildCategoryTree(categoryId: Types.ObjectId, categories: CategoryDocument[]): any[] {
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
            return this.findPathToRoot(startingNode, categoryMap)
        }

        return rootNodes
    }
}