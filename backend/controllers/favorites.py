from typing import Any, Dict, List

from fastapi import HTTPException, status
from schemas.auth import TokenData
from supabase import Client


async def toggle_favorite_controller(
    lesson_id: int, user: TokenData, supabase: Client
) -> Dict[str, Any]:
    try:
        # Check if the lesson exists
        lesson_check = (
            supabase.table("lessons").select("id").eq("id", lesson_id).execute()
        )
        if not lesson_check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found"
            )

        # Check if the favorite already exists
        existing_favorite = (
            supabase.table("favorites")
            .select("id")
            .eq("user_id", user.user_id)
            .eq("lesson_id", lesson_id)
            .execute()
        )

        if existing_favorite.data:
            # Favorite exists, so remove it
            (
                supabase.table("favorites")
                .delete()
                .eq("user_id", user.user_id)
                .eq("lesson_id", lesson_id)
                .execute()
            )

            return {
                "status": "success",
                "action": "removed",
                "message": "Lesson removed from favorites",
                "is_favorited": False,
                "favorite_id": None,
            }
        else:
            # Favorite doesn't exist, so add it
            new_favorite = (
                supabase.table("favorites")
                .insert({"user_id": user.user_id, "lesson_id": lesson_id})
                .execute()
            )

            return {
                "status": "success",
                "action": "added",
                "message": "Lesson added to favorites",
                "is_favorited": True,
                "favorite_id": new_favorite.data[0]["id"]
                if new_favorite.data
                else None,
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error toggling favorite: {str(e)}",
        )


async def get_favorites_controller(user: TokenData, supabase: Client) -> List[Dict]:
    try:
        favorites_response = (
            supabase.table("favorites")
            .select("*")
            .eq("user_id", user.user_id)
            .execute()
        )

        return favorites_response.data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting favorites: {str(e)}",
        )
